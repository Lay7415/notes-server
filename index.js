const router = require('./routes/index.js')
const express = require("express");

const app = express();
app.use(express.json())
app.use('/api', router)

const PORT = 5000;

app.listen(PORT, () => console.log(`server opens in port ${PORT}`));
