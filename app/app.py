import os
import requests
from flask import Flask, jsonify, render_template
from flask_restful import Api, Resource

IDATALABS_API = 'https://api.idatalabs.com/v1'
IDATALABS_API_KEY = os.environ.get('IDATALABS_API_KEY', '')

app = Flask(__name__)
api = Api(app)

@app.route('/')
def form():
    """Render the main page."""
    return render_template('form.html')

class QueryCompanies(Resource):
    """Proxy the iDatalabs endpoint."""
    def get(self, product_slug):
        url = '/'.join([
            IDATALABS_API,
            'companies',
            'aggregate',
            '?product_slug={}&groupby=industry'.format(product_slug),
        ])
        response = requests.get(url, auth=('', IDATALABS_API_KEY))
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'status': 'failure'})

api.add_resource(QueryCompanies, '/companies/<string:product_slug>')
