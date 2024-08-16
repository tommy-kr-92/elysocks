/* dotenv의 내용 가져오기 */
require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const port = process.env.PORT;

/* routers */
const adminRouter = require('./routes/admin');

/* mongooose connection */
mongoose
    .connect('mongodb://127.0.0.1:27017/elysocks')
    .then(() => {
        console.log('MONGO 연결 완료!!!');
    })
    .catch((err) => {
        console.log('MONGO 연결 실패!!!');
        console.log(err);
    });

/* cors */
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* middleware */
app.use(morgan('dev'));

/* routers */
app.use('/api/admin', adminRouter);

app.listen(port, () => {
    console.log(`PORT ${port} 연결 완료!`);
});
