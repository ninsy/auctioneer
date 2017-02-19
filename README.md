A. Setting up on local environment

    Prerequisites:
        - Install Node.js runtime together with NPM package manager

    1. Create .env file at project root, which should contain fields:
        - DB_PASS
        - DB_HOST
        - DB_USER
        - GAPI_EMAIL ( field "client_email" located in json containing authentication metadata )

    2. Create file "gapi_key.pem" inside server/config/keys, which should contain
        google api private key

    3. Checkout to desired branch
    4. Run command "npm run init" inside project root directory

B. Deploying to production

    1. Create .env file, which should contain exact files as its development 
        environment counterpart, expect for additional field "GAPI_PKEY"
        populated with field "private_key" from authentication metadata json.