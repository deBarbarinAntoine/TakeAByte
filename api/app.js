const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const routes = require('./routes/products');

app.use(cors());

app.use('/static', express.static('./public'));
app.use(routes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
