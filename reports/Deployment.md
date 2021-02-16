# Deployment/installation guide

This is a guide on how to run the code.

## Install dependencies
* Change the file directory to ./code
* Assume that you have npm install already:
```
npm install
```
* If there are still vulnerabilities, run in terminal:
```
npm audit fix
npm audit fix --force
```

## Run the code
* Uncomment the functions in index.js
* Run in termital:
```
npm start
```
You should able to see the ingestion/performance tests results in the terminal.
* Note: QueryFromGCP is somehow failed due to dataset location issues. I will try to fix that in following assignments.