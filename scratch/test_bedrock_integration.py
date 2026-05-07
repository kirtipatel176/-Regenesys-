import asyncio
import os
import sys

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Load environment variables
from dotenv import load_dotenv
load_dotenv('backend/.env')

from app.ai.llm_provider import get_llm_provider

async def test_bedrock():
    try:
        provider = get_llm_provider()
        print(f"Testing provider: {provider.__class__.__name__}")
        print(f"Model: {provider.model_name}")
        
        response = provider.generate("Say hello!")
        print(f"Response: {response['text']}")
        print(f"Usage: {response['usage']}")
    except Exception as e:
        print(f"Error testing Bedrock: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_bedrock())
