class GlobalErrorClass extends Error{
    public statusCode:number;
    public message:string;
    public isOperational:boolean;

    constructor(message:string,statusCode:number,isOperational=true){
     super(message);
     this.isOperational=isOperational;
     this.message=message;
     this.statusCode=statusCode;

     Error.captureStackTrace(this)
     
    }
};


export default GlobalErrorClass;