# Setup Instructions

## 1. Start Infrastructure
Run the following command to start the database, redis, and ollama services:
```bash
docker-compose up -d
```

## 2. Pull Required Models
Execute these commands to download the models into the ollama container. These are required for the API to function:
```bash
docker exec -it ollama ollama pull qwen2.5:1.5b
docker exec -it ollama ollama pull bge-m3
```

## 3. Configuration and Model Swapping
The model names used by the application are defined in `app/core/settings.py`. To change the models, update the following variables:

* **LLM:** `OLLAMA_LLM_MODEL` (Default: `"qwen2.5:1.5b"`)
* **Embedding:** `OLLAMA_EMBEDDING_MODEL` (Default: `"bge-m3"`)

### Changing Models
If you change a model name in the settings, you must pull the new model manually:
```bash
docker exec -it ollama ollama pull <NEW_MODEL_NAME>
```

## 4. Verification
Verify that the models are correctly installed:
```bash
docker exec -it ollama ollama list
```