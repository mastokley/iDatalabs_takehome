import os
import requests
from flask import Flask, render_template

app = Flask(__name__)

API_STUB = 'http://api.nordglobal.net/api'
API_KEY = os.environ.get('IDATALABS_API_KEY', '')

@app.route('/')
@app.route('/form')
def form():
    return render_template('form.html')
