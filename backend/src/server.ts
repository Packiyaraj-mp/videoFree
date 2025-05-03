import app from "./app";
import getEnv from "../config/getEnv";
import cors from 'cors';
import dbConnection from "./models/dbConnection";
import {Server} from 'socket.io';
import {createServer} from 'http';
import express from 'express';
import { RtcRole, RtcTokenBuilder } from "agora-access-token";

const router=express.Router();
const APP_ID='8b0c9815fabf4258be88e952848727f2';
const APP_CERTIFICATE='c4311d144e1e4e6fb72d2550862216eb';
// env variables
const port=getEnv('PORT');

// interface
interface JoinedUsers{
[userId:string]:string;
};

const joinedUsers:JoinedUsers={};

const server=createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*"
    }
});

app.post('/rtcToken',(req,res,next)=>{

const {channelName,accountUser}=req.body;
console.log(accountUser)
if(!channelName || accountUser==null){
res.status(400).json({
msg:'require Info'
})
return
};

const role=RtcRole.PUBLISHER;
const expirationTimeInSeconds=3600;
const currentTimestamp=Math.floor(Date.now()/1000);
const privilegeExpiredTs=currentTimestamp+expirationTimeInSeconds;

const token=RtcTokenBuilder.buildTokenWithAccount(
APP_ID,
APP_CERTIFICATE,
channelName,
accountUser,
role,
privilegeExpiredTs
);
res.json({token})

});

io.on('connection',(socket)=>{
    // register user
socket.on('register',(id)=>{
    joinedUsers[id]=socket.id;
    console.log(`${id} successfully registered`)
});

socket.on('call-user',({sender,from,to,channelName})=>{

    const targetUser=joinedUsers[to];
    if(targetUser){
        io.to(targetUser).emit('incoming-call',{sender,from,channelName})
    }
});



});

server.listen(port,()=>{
    console.log(`server is running on port number is ${port}`);
    dbConnection()
});

