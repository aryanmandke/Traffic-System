const express = require('express');
const app = express();
const cors = require('cors') ;
const body_parser = require('body-parser') ;
const driver = require('./routes/driver') ;
const police = require('./routes/police') ;
require("dotenv").config() ;
require('./conn/conn') ;

app.use(body_parser.json()) ;
app.use(cors()) ;

app.use("/api/v1",driver) ;
app.use("/api/v1",police) ;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));