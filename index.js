var mysql = require("mysql");
const express = require('express');
var http = require('http');
const bodyparser = require('body-parser');
const { runInNewContext } = require("vm");
const { CONNREFUSED } = require("dns");
const path = require('path');



const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mysql"
});


db.connect((err) => {
  if(err) {
    throw err;
  }
  console.log('MySql Connected...')
});

const app = express();

app.get('/createdb',(req,res) => {
  let sql = 'CREATE DATABASE hms';
  db.query(sql,(err,result) => {
    if(err) throw err;
    console.log(result);
    res.send("database created ...")
  });
});

app.get('/createposttable',(req,res) => {
  let sql = 'CREATE TABLE cred(userid varchar(30),userpass varchar(30))';
  db.query(sql,(err,result)   => {
    if(err) throw err;
    console.log(result);
    res.send('Post table created');
  });
});

app.get('/createappointment',(req,res) => {  
  let sql = 'CREATE TABLE app4(name varchar(30),email varchar(30),purpose varchar(50),mobile varchar(11),department varchar(35),dateofapp varchar(30),time varchar(12))';
  db.query(sql,(err,result)   => {
    if(err) throw err;
    console.log(result);
    res.send('appoitment table created'); 
  });
});

app.use(bodyparser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000})); 

app.post('/up', (req, res) => {
  console.log(  req.body.field1); 
  let sql = 'insert into postsssss values("'+req.body.field1+'","'+req.body.field2+'");'; 
  db.query(sql,(err,result) => {
    if(err) throw err;
    console.log(result);    
  });
  res.send(sql);
});

app.get('/print',(req,res) => {
  let sql = 'select * from app4';
  let respsonse = ''
  db.query(sql,(err,result) => { 
    if(err) throw err;
    console.log(result);
    for(i in result){
      respsonse = respsonse + '<ul>'+ result[i].name +"\t | \t"+  result[i].email + "\t | \t"+  result[i].purpose +"\t | \t" + result[i].mobile +"\t | \t" + result[i].department + "\t | \t"+  result[i].dateofapp +"\t | \t" + result[i].time + '</ul>';
      console.log(respsonse);
    }
    res.send(respsonse);
  });
});

app.post('/push', (req, res) => { 
  var entereduserpass = req.body.usrpsw ;
  console.log(entereduserpass);
  let respsonses = ''
  let sql = 'select * from app4';
  let sql2 = 'select * from cred where userid = "'+ req.body.userid+'";';
  db.query(sql2,(err,result) => { 
    if(err) throw err;
    console.log(result); 

    if(result[0].userpass == entereduserpass){
      console.log("-----VALID----");

      db.query(sql,(err1,results) => { 
        if(err1) throw err1;
        console.log(results);
        for(i in results){
          respsonses = respsonses + '<ul>'+ results[i].name +"\t | \t"+  results[i].email + "\t | \t"+  results[i].purpose +"\t | \t" + results[i].mobile +"\t | \t" + results[i].department + "\t | \t"+  results[i].dateofapp +"\t | \t" + results[i].time + "   "+'</ul>';
          
        }
        console.log(respsonses);
        res.send('<html><body>User Authicated <a href="http://127.0.0.1:5500/HMS/login.html">Click me to LogOut </a> <br> '+ respsonses +'</body></html>');
      });


      
    }else{
      console.log("-----NOT VALID-----");
      res.send('Password Incorrect<html><body>User Authicated <a href="http://127.0.0.1:5500/HMS/login.html">Click me to go back </a></body></html>');
    }
  });   
});

app.post('/appoint', (req, res) => {
  console.log(req.body);

  let sql2 = 'insert into app4 values ("'+req.body.name+'","'+req.body.email+'","'+req.body.subject+'","'+req.body.number+'","'+req.body.Department+'","'+req.body.dateofa+'","'+req.body.Time +'");';


  db.query(sql2,(err,result) => {
    if(err) throw err;
    console.log(result);    
  });

  res.send('Appointment booked successfully<html><body>User Authicated <a href="http://127.0.0.1:5500/HMS/index.html">Go To Home page </a></body></html>"'); 
    
});



app.listen('3000',()=>{
  console.log("server started on port 3000")
});

