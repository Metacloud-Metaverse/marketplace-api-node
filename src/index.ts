const env = require('dotenv').config()
const express = require('express')
const ApiRoutes = require('./routes/app.ts')
const compression = require("compression")
const cors = require('cors')

const port = Number(process.env.PORT || 3001)
const app = express()

app.use(cors())
app.use(compression())
app.use(express.json())
app.use('/', ApiRoutes)

    app.listen(port, () =>
    console.log(`Listening on ws://localhost:${port}`)
);
