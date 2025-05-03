import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path:'./config/.env'});

const getEnv=(name:string)=>{
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable error`);
      }
      return value;
};

export default getEnv;