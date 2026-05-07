import json
import os

import boto3
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')

def test_raw_bedrock():
    try:
        session_kwargs = {
            "aws_access_key_id": os.getenv("AWS_ACCESS_KEY_ID"),
            "aws_secret_access_key": os.getenv("AWS_SECRET_ACCESS_KEY"),
            "region_name": os.getenv("AWS_REGION", "us-east-1")
        }
        
        print(f"Testing with Region: {session_kwargs['region_name']}")
        print(f"Access Key ID: {session_kwargs['aws_access_key_id'][:10]}...")
        
        client = boto3.client("bedrock-runtime", **session_kwargs)
        
        # Try Claude 3.5 Sonnet (v1)
        model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
        
        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 100,
            "messages": [{"role": "user", "content": "Say hello!"}]
        })
        
        print(f"Invoking model: {model_id}")
        response = client.invoke_model(
            modelId=model_id,
            body=body
        )
        
        response_body = json.loads(response.get('body').read())
        print("Success!")
        print(f"Response: {response_body.get('content')[0].get('text')}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_raw_bedrock()
