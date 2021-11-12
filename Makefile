install:
	sudo apt-get install python3
	sudo apt-get install python3-virtualenv

run: plot
	./.venv/bin/python3 hello_world.py

plot: refine
	./.venv/bin/python3 plot.py

refine: setup
	./.venv/bin/python3 refine.py

setup: requirements.txt
	virtualenv .venv
	./.venv/bin/pip install -r requirements.txt

clean:
	rm -rf __pycache__
	rm -rf .venv
	rm refined_*.csv
	rm *.png

.PHONY: clean