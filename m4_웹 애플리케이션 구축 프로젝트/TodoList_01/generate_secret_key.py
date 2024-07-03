import secrets

def genearte_secret_key():
    return secrets.token_hex(24)

secret_key = genearte_secret_key()
print(f'Secret Key: {secret_key}')