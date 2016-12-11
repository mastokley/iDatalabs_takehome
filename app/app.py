import os
import requests
from flask import Flask, render_template

app = Flask(__name__)

API = 'https://api.idatalabs.com/v1'
API_KEY = os.environ.get('IDATALABS_API_KEY', '')

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/companies/<product_slug>')
def query_companies(product_slug):
    """Proxy the iDatalabs api endpoint."""
    url = '/'.join([
        API,
        'companies',
        'aggregate',
        '?product_slug={}&groupby=industry'.format(product_slug),
    ])
    response = requests.get(url, auth=('', API_KEY))
    if response.status_code == 200:
        out = response.text
    else:
        out = 'Unable to retrieve data from third party API.'
    return out
