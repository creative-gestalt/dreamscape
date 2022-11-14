# Dreamscape

## Visiting the application
Once this is running, you can visit the site via the host's IP or hostname + the frontend port you set:<br />
ex: `http://192.168.0.105:8080/`

## Installation

_prerequisites:_

- docker

You can run this on windows docker or linux. Linux is preferred.

_Linux_

```bash
~$ git clone <this-repo>
~$ cd dreamscape/
~/dreamscape$ touch .env
```

_Windows_

```
PS C:\Users\<you>\projects> git clone <this-repo>
PS C:\Users\<you>\projects\dreamscape> New-Item .env
```

## Environment

You'll need to add appropriate env variables before you build the container.<br />
Below are the keys you'll need. Set appropriate data according to your network / host.

```dotenv
# UI
FRONT_PORT=8080

# Server
SERVER_HOST=127.0.0.1 # <- must be the host's IP on your network, the application requests here via http
SERVER_PORT=3000

# Database
DB_ROOT_USER=root
DB_ROOT_PWD=root
DB_USER=dreamscape_usr
DB_PWD=dreamscape_pwd
DB_NAME=dreamscape_db
DB_PORT=27017
```

## Build

_root dir_

```bash
~/dreamscape$ docker compose up -d --build
```

- _this can take some time so be patient while it builds_
- _docker will cache portions of the build, making subsequent builds faster after the first build_

### That's it. For any tweaking or data management, continue.

## Updating

If you change any `.env` variables, be sure to run `$ docker compose up -d --build`to force copying files into the
production containers.

## Database

Connect via MongoDB Compass by placing the following values into the connection string:<br />

```
mongodb://{DB_USER}:{DB_PWD}@{SERVER_HOST}:{DB_PORT}/{DB_NAME}
```

ex: `mongodb://dreamscape_usr:dreamscape_pwd@192.168.0.105:27017/dreamscape_db`

<br />If you want to view all database, use the root user / pwd without a database specified:

```
mongodb://{DB_ROOT_USER}:{DB_ROOT_PWD}@{SERVER_HOST}:{DB_PORT}/
```

ex: `mongodb://root:root@192.168.0.105:27017/`

## Backup & Restore

### Backup

If you want to run a cron to maintain backups or just want to run it via command:

```
mongodump --uri="mongodb://{DB_USER}:{DB_PWD}@{SERVER_HOST}:{DB_PORT}" --db={DB_NAME} --out=/home/<you>/db/
```

ex: `mongodump --uri="mongodb://dreamscape_usr:dreamscape_pwd@192.168.0.105:27017" --db=dreamscape_db --out=/home/nick/db/`

### Restore

```
mongorestore --host={SERVER_HOST} --port={DB_PORT} --username={DB_USER} --password={DB_PWD} --authenticationDatabase={DB_NAME} /path/to/any-dir/
```

ex: `mongorestore --host=192.168.0.105 --port=27017 --username=dreamscape_usr --password=dreamscape_pwd --authenticationDatabase=dreamscape_db /home/nick/db/`

