'use strict';
const fs = require('fs');
const fetch = require('node-fetch');
const {BigQuery} = require('@google-cloud/bigquery');
const bigqueryClient = new BigQuery();
const csv=require('csvtojson')
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://bdp-assignment:625031983@cluster1.7zbe3.mongodb.net/mydb?retryWrites=true&w=majority";

const QueryFromGCP = async() => {
    const sqlQuery = `SELECT *
            FROM \`bigquery-public-data.covid19_public_forecasts\`
            LIMIT 10`;

        const options = {
        query: sqlQuery,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'US',
        };

        // Run the query
        const [rows] = await bigqueryClient.query(options);

        console.log('Rows:');
        rows.forEach(row => console.log(row));
}


//QueryFromGCP()

const IngestionFromApi = async() => {
    const dataurl = "https://opendata.ecdc.europa.eu/covid19/casedistribution/json";
    let settings = { method: "Get" };
    fetch(dataurl, settings)
        .then(res => res.json())
        .then((json) => {
        let data = json.records;
        MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        const dbo = db.db("mydb");
        //let rawdata = fs.readFileSync('../data/COVID-19.json');
        //let data = JSON.parse(rawdata);
        
        dbo.collection("COVID-19").insertMany(data, (err, res) => {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
            });
        });
    });
    
}

//IngestionFromApi()

const IngestionFromFile = async() => {
    csv()
    .fromFile("../data/data_bts_bts-data-alarm-2017.csv")
    .then((jsonObj)=>{
        MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        const dbo = db.db("mydb");
        dbo.collection("BTS").insertMany(jsonObj, (err, res) => {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
            });
        }); 
    })
}

IngestionFromFile()