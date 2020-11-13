import {connection, connect} from 'mongoose';

export const connectToDatabase = () => connect('mongodb://localhost/filestorage',{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

export const Database = connection;
