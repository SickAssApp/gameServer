const express = require('express');
const app = express();

require('./config/route_config')(app);

app.use(express.static('public'));

console.log('Server started.')
app.listen(process.env.PORT || 5000);