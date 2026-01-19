# Distributed-Systems-Final-Project

## Prerequisites:
In order to run this project you will need to already have insatalled the following:
- Node.js
- Docker

## Environment setup

### 1. Clone the repository
```powershell
git clone https://github.com/Johnccg/Distributed-Systems-Final-Project.git 
```

### 2. Install packages
```powershell
npm install
```

### 3. Setup docker container
```powershell
docker compose up -d
```

## Running the project

### Server

Once the docker container is running the server starts automatically, in order to run the server locally go to ```dedupe.js```, ```index.js```, `````redis.js``` and swap the commented lines with the uncommented line below.

Then you can run an instance in the default port (3000)
```powershell
npm start
```

Or run instances in different ports by defining the port when starting the server
```powershell
$env:PORT=3000; npm start
$env:PORT=3001; npm start
```

To run multiple instances of the server each command  needs to be run in separate terminals

### Client

To run an instance of the client simply navigate to the client folder, and open index.html
