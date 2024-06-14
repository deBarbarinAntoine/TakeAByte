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
const imagesRoutes = require('./routes/image');
const tokenRoutes = require('./routes/token');

app.use(cors());
app.use(express.json());

app.use('/static', express.static('./public'));
app.use('/v1',productsRoutes);
app.use('/v1',userRoutes);
app.use('/v1/auth',authRoutes)
app.use('/v1/product/like',likeRoutes)
app.use('/v1',ordersRoutes)
app.use('/v1',salesRoutes)
app.use('/v1',brandsRoutes)
app.use('/v1',colorsRoutes)
app.use('/v1',typesRoutes)
app.use('/v1',imagesRoutes)
app.use('/v1',tokenRoutes)


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
