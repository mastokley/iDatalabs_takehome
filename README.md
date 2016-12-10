# Basic Use
1. Create and enter a virtual environment (not necessary, but recommended). App
   should be python 2.7 and python 3.5 compatible.

```bash
virtualenv -p $(which python2.7) ~/.virtualenvs/iDatalabs_takehome
source ~/.virtualenvs/iDatalabs_takehome/bin/activate
```

2. Install the requirements:

```bash
pip install -r requirements.txt
```

3. Configure your environment:

```bash
export FLASK_APP=app
```

4. Run the application:

```bash
python -m flask run
```
