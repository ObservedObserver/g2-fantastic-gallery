import json

with open('./earthquakes.json', 'r') as f:
    data = json.loads(f.read())
    print(len(data['features']))