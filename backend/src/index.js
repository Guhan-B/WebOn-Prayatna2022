const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const helmet = require('helmet')

const { ConnectToDatabase } = require('./database/Database');
const errorHandler = require('./middlewares/error');
const { accessHandler } = require('./middlewares/authentication');
const authenticationRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');

const startServer = async () => {
    dotenv.config();

    const app = express();

    app.use(express.json());
    app.use(helmet());
    app.use(cors());

    app.use('/user', accessHandler, userRoutes)
    app.use('/auth', authenticationRoutes);

    app.use(errorHandler);

    const PORT = 8000;

    try {
        const client = await ConnectToDatabase();
        console.log("[SUCCESS] Connected to database successfully")
        app.listen(PORT, () => {
            console.log(client);
            console.log(`[SUCCESS] server is running at ${PORT}`);
        })
    } catch (error) {
        console.log(error);
        console.log("[ERROR] Unable to start server");
    }
}

startServer();
