const express = require('express');
const path = require('path');
const wordBank = require('./config/wordBank');

module.exports = app =>{
    app.get('/getVcab', (req,res)=>{
        console.log('Get vacabulary');
        res.send();
    });
}