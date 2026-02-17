import httpx
import json
import re
import os

async def get_stepfun_estimation(task_title: str, task_desc: str, context: str):
    url = "https://openrouter.ai/api/v1/chat/completions"
    api_key = os.getenv("OPENROUTER_API_KEY")

    prompt = (
        f"Task: {task_title}\nDescription: {task_desc}\nContext: {context}\n\n"
        "Return ONLY a valid JSON object with: 'estimated_minutes' (int), "
        "'confidence_score' (float), 'explanation' (string)."
    )

    # bad model but works fine for now!!!
    payload = {
        "model": "stepfun/step-3.5-flash:free",
        "messages": [
            {"role": "system", "content": "You are a project manager. Respond in JSON."},
            {"role": "user", "content": prompt}
        ],
        "reasoning": {"enabled": True}
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                url, 
                headers={"Authorization": f"Bearer {api_key}"},
                json=payload,
                timeout=30.0
            )
            
            if response.status_code != 200:
                return None

            data = response.json()
            content = data['choices'][0]['message'].get('content', "")
            
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            return json.loads(json_match.group()) if json_match else None
        except Exception:
            return None