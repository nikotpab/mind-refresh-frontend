import json
import urllib.request

def extract_body(html):
    try:
        start = html.index('<body')
        start = html.index('>', start) + 1
        end = html.index('</body>')
        return html[start:end].strip()
    except ValueError:
        return html

with open('/Users/niko/.gemini/antigravity/brain/b07e9d56-4b6e-4671-af2a-5810124f4e4e/.system_generated/steps/133/output.txt', 'r') as f:
    data = json.load(f)

mapping = {
    "Catálogo de Eventos": "event-catalog/event-catalog.html",
    "Registro Emocional": "emotional-record/emotional-record.html",
    "Consola de Gestión de Eventos": "event-management/event-management.html",
    "Acceso al Ecosistema": "login/login.html",
    "Dashboard del Colaborador": "collaborator-dashboard/collaborator-dashboard.html",
    "Analítica de Sentimiento Agregado": "sentiment-analytics/sentiment-analytics.html",
    "Dashboard Estratégico y EVM": "strategic-dashboard/strategic-dashboard.html"
}

for screen in data['screens']:
    title = screen['title']
    if title in mapping:
        url = screen['htmlCode']['downloadUrl']
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            body = extract_body(html)
            
            out_path = f"/Users/niko/Desktop/mind-refresh/mind-refresh-frontend/src/app/pages/{mapping[title]}"
            with open(out_path, 'w') as out:
                out.write(body)
                print(f"Wrote {title} to {out_path}")
