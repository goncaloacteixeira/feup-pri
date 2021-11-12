install:
	sudo apt-get install virtualenv

run: refine
	./.venv/bin/python3 hello_world.py

setup: requirements.txt
	virtualenv .venv
	./.venv/bin/pip install -r requirements.txt

refine: setup
	./.venv/bin/python3 refine.py

plot: refine
	./.venv/bin/python3 plot.py

clean:
	rm -rf __pycache__
	rm -rf .venv
	rm refined_*.csv
	rm *.png

.PHONY: clean