import os
import requests
from flask import Flask, jsonify, render_template
from flask_restful import Api, Resource

IDATALABS_API = 'https://api.idatalabs.com/v1'
IDATALABS_API_KEY = os.environ.get('IDATALABS_API_KEY', '')


class AlternateJinjaDelimitersFlask(Flask):
    """Avoid delimiter collision with vue.js"""
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        block_start_string='{%',
        block_end_string='%}',
        variable_start_string='[[',
        variable_end_string=']]',
        comment_start_string='{#',
        comment_end_string='#}',
    ))

app = AlternateJinjaDelimitersFlask(__name__)

api = Api(app)

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

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
