const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('./models/user');
require('./models/post');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')


let connectURL = '';
if(process.env.NODE_ENV == 'production'){
    const {MONGOURI} = require('./config/keys');
    connectURL = MONGOURI;
} else{
    connectURL = 'mongodb://127.0.0.1:27017/insta-clone';
}
// const connectURL = 'mongodb://127.0.0.1:27017/insta-clone';
// const connectURL = 'mongodb+srv://arnabk:uH8DgAh0BUDuIxin@cluster0.rgpjy.mongodb.net/<dbname>?retryWrites=true&w=majority';

const PORT = process.env.PORT || 5000;


mongoose.connect(connectURL, {
    useNewUrlParser: true,
    useCreateIndex: true
})

mongoose.connection.on('connected',()=>{
    console.log('Connected to mongo DB')
})

mongoose.connection.on('error',(err)=>{
    console.log('Error Connecting', err)
})

app.use(express.json());
app.use(authRouter);
app.use(postRouter);
app.use(userRouter);

if(process.env.NODE_ENV == 'production'){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, ()=>{
    console.log('Listening to port 5000')
})