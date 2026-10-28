# Encrypted transfer to the new YidPad release Mac

This directory contains a PUBLIC recipient certificate. Its private key stays on the new Mac and must never enter Git.

Recipient public-key SPKI SHA-256:
`426fe1eb83346b20488233892d3cdee0235d0d484de004bf3729158355bd6b14`

The existing update signing key must independently match SPKI SHA-256:
`df93c9f5fc0a07b6d68fa894d7791e50f125b74b994f016ace2257ffd3c4720d`

On the original Mac, verify both public fingerprints. Encrypt the existing update signing key with OpenSSL CMS in binary DER format, AES-256-CBC, using recipient.pem. Add ONLY the resulting `update-signing-key.cms` ciphertext to this directory. Never add plaintext PEM private keys, passwords, or the transfer private key. Preserve the original signing key. Push the encrypted file to main without overwriting others' changes.

The new Mac decrypts to its owner-only transfer folder and verifies the recovered key's public fingerprint before importing it through scripts/release-workstation.py. This does not rotate tablet trust. The public certificate expires after 14 days; its transfer private key is retained locally until completion.
