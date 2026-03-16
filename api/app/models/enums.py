import enum


##########################################
##########################################
class LanguageEnum(str, enum.Enum):
    AR = "AR"
    FR = "FR"
    EN = "EN"


##########################################
##########################################
class JobStatus(str, enum.Enum):
    PENDING = "PENDING"
    STARTED = "STARTED"
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"