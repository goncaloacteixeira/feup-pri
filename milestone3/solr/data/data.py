import gdown

url = 'https://drive.google.com/drive/folders/1jH_QmQBXTpjxVnC1eJfyczw7yNPrwEsG?usp=sharing'
gdown.download_folder(url, quiet=False)