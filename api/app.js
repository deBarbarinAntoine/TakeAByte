const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
const productsRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/authentication')
const likeRoutes = require('./routes/like')
const ordersRoutes = require('./routes/orders')
const salesRoutes = require('./routes/sales')
const brandsRoutes = require('./routes/brand');
const colorsRoutes = require('./routes/color');
const typesRoutes = require('./routes/type');

app.use(cors());
app.use(express.json());

app.use('/static', express.static('./public'));
app.use(productsRoutes);
app.use(userRoutes);
app.use(authRoutes)
app.use(likeRoutes)
app.use(ordersRoutes)
app.use(salesRoutes)
app.use(brandsRoutes)
app.use(colorsRoutes)
app.use(typesRoutes)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
