import os
import time

os.environ["TQDM_DISABLE"] = "0"
os.environ["FORCE_COLOR"] = "1"
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "0"

from fastembed import TextEmbedding
from flashrank import Ranker

CACHE_DIR = "/models_cache"

def download_with_retries(task_name, func):
    for i in range(5):
        try:
            print(f"\n--- Attempt {i+1}: Starting {task_name} ---")
            func()
            print(f"\n--- {task_name} completed successfully ---")
            return
        except Exception as e:
            print(f"Error downloading {task_name}: {e}")
            time.sleep(5)
    raise Exception(f"Failed to download {task_name} after 5 attempts")

if __name__ == "__main__":
    os.makedirs(CACHE_DIR, exist_ok=True)
    
    download_with_retries(
        "FastEmbed", 
        lambda: TextEmbedding(model_name="intfloat/multilingual-e5-large", cache_dir=CACHE_DIR)
    )
    
    download_with_retries(
        "FlashRank", 
        lambda: Ranker(model_name="ms-marco-MultiBERT-L-12", cache_dir=CACHE_DIR)
    )