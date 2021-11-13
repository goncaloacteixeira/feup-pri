all: database

database: plot
	./.venv/bin/python3 database.py

plot: refine
	./.venv/bin/python3 plot.py

refine: setup
	./.venv/bin/python3 refine.py

setup: requirements.txt
	virtualenv .venv
	./.venv/bin/pip install -r requirements.txt

install:
	sudo apt-get install python3
	sudo apt-get install python3-virtualenv

clean:
	rm -rf __pycache__
	rm refined_*.csv
	rm *.png
	rm database.db

.PHONY: clean setup refine plot database run install