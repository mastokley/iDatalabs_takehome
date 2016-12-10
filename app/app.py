import requests
from flask import Flask

app = Flask(__name__)

API_STUB = 'http://api.nordglobal.net/api'

@app.route('/')
@app.route('/index')
def hello_world():
    return 'hello, world'


@app.route('/autocomplete/<query>')
def autocomplete(query):
    response = requests.get(''.join([API_STUB,
                                     '/v1/search?query={}'.format(query)]))
    return '<br>'.join(_['id'] for _ in response.json()['narratives'])

