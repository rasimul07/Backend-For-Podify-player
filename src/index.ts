// npm i -D @types/express typescript @types/node ts-node-dev
//  npm i express

import express from "express";
const app = express();
const PORT = 8989;

app.listen(PORT,()=>{
    console.log('Server is listening on port '+PORT)
})