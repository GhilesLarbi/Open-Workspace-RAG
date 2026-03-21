import json
import uuid
from typing import List
from redis.asyncio import Redis
from app.schemas.chat import SessionTurn

class SessionRepository:
    def __init__(self, redis: Redis):
        self.redis = redis
        self.prefix = "session"
        self.ttl = 86400


    ###########################################################################################
    ###########################################################################################
    def _get_key(
        self, 
        workspace_id: uuid.UUID, 
        session_id: str
    ) -> str:
        return f"{self.prefix}:{workspace_id}:{session_id}"

    ###########################################################################################
    ###########################################################################################
    async def get_turns(
        self, 
        workspace_id: uuid.UUID, 
        session_id: str,
        skip: int = 0,
        limit: int = 10
    ) -> List[SessionTurn]:
        key = self._get_key(workspace_id, session_id)
                
        raw_turns = await self.redis.lrange(
            name=key, 
            start=skip, 
            end=skip + limit - 1
        )
        
        turns = []
        for raw in raw_turns:
            try:
                turns.append(SessionTurn.model_validate_json(raw))
            except Exception:
                continue
                    
        return turns[::-1]

    ###########################################################################################
    ###########################################################################################
    async def add_turn(
        self, 
        workspace_id: uuid.UUID, 
        session_id: str, 
        turn: SessionTurn, 
    ) -> None:

        key = self._get_key(workspace_id, session_id)
        turn_json = turn.model_dump_json()
        await self.redis.lpush(key, turn_json)
        # await self.redis.ltrim(key, 0, 10)
        await self.redis.expire(key, self.ttl)

    ###########################################################################################
    ###########################################################################################
    async def clear_session(
        self, 
        workspace_id: uuid.UUID, 
        session_id: str
    ) -> None:
        key = self._get_key(workspace_id, session_id)
        await self.redis.delete(key)