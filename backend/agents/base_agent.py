import torch
from transformers import AutoTokenizer, T5ForConditionalGeneration
import logging

logger = logging.getLogger(__name__)

class BaseAgent:
    def __init__(self):
        try:
            self.model_name = "google/flan-t5-small"
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            logger.info(f"Using device: {self.device}")
            
            logger.info("Loading tokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            
            logger.info("Loading model...")
            self.model = T5ForConditionalGeneration.from_pretrained(self.model_name)
            self.model = self.model.to(self.device)
            logger.info("Model loaded successfully")
            
        except Exception as e:
            logger.error(f"Error initializing BaseAgent: {str(e)}")
            raise
    
    async def process(self, input_text: str, max_length: int = 150) -> str:
        try:
            # Tokenize input
            inputs = self.tokenizer(
                input_text,
                return_tensors="pt",
                max_length=512,
                truncation=True
            ).to(self.device)
            
            # Generate output
            outputs = self.model.generate(
                inputs.input_ids,
                max_length=max_length,
                num_beams=4,
                temperature=0.7,
                early_stopping=True
            )
            
            # Decode and return
            result = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return result.strip()
            
        except Exception as e:
            logger.error(f"Error processing text: {str(e)}\nInput text: {input_text}")
            raise
