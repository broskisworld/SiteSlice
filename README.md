# Ports

Frontend - localhost:80

Backend save API - localhost:5500

Backend proxy service - localhost:5600

# Launch commands

All commands are written as if they were run from the top level project dir. These four will NOT work if dumped in a shell file in succession

```
# launch frontend
cd Frontend && npm install && npm run start

# launch backend save api (also currently proxy service)
cd Backend && yarn install && yarn run start

# launch backend proxy service
# TBD? currently just use backend save api command

# launch testbench
# (may need to configure test URL first)
cd Frontend/Testbench && npm install && npm run start
```