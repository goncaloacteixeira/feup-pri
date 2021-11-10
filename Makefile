run: refine
	./.venv/bin/python3 hello_world.py

setup: requirements.txt
	virtualenv .venv
	./.venv/bin/pip install -r requirements.txt

refine: setup
	./.venv/bin/python3 refine.py

install:
	sudo apt-get install virtualenv

clean:
	rm -rf __pycache__
	rm -rf .venv

.PHONY: clean