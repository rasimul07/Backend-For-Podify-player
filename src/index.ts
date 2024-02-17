// npm i -D @types/express typescript @types/node ts-node-dev
//  npm i express
// npm i -D tsconfig-paths //and edit in tsconfig.json file //add path "paths": {
    //   "#/*" : ["./src/*"]
    // }  //and edit is package.json // "scripts": {
//     "dev": "tsnd --respawn -r tsconfig-paths/register --pretty --transpile-only ./src/index.ts"
//   },

import express from "express";
import dotenv from 'dotenv';
dotenv.config()
import './db'
const app = express();
const PORT = process.env.PORT || 8989;

import router from '#/routers/auth';
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use('/auth',router);
app.listen(PORT,()=>{
    console.log('Server is listening on port '+PORT)
})

/**
 * The plan and features
 * upload audio files
 * listen to single audio
 * add to favorites
 * create playlist
 * remove playlist (public-private)
 * remove audios
 * many more
 */