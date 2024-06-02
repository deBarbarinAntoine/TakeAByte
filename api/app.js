const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const productsRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

app.use(cors());
app.use(express.json());

app.use('/static', express.static('./public'));
app.use(productsRoutes);
app.use(userRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
