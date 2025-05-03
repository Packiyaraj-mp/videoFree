import express from 'express';

const app=express();


app.use(express.json({limit:'10mb'}))

// auth routes
import authRoutes from './routes/authRoutes';
import fileRoutes from './routes/fileRoutes';
import friendsRoutes from './routes/friendsRoute';
import callRoutes from './routes/callRoutes';
import ErrorHandler from './middileWare/ErrorHandler';

// auth ponts
app.use('/auth',authRoutes);
app.use('/file',fileRoutes);
app.use('/friends',friendsRoutes);
// app.use('/stream',callRoutes);

app.use(ErrorHandler);

export default app;