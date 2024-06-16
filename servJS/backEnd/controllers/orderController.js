const axios = require('axios');

require('dotenv').config();

async function getUserOrdersByUserId(user_id){
    let array_of_orders = [];
    try {
        const url = `http://localhost:3001/v1/users/${user_id.user_id}/orders`;
        const token = process.env.WEB_TOKEN;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data) {
            array_of_orders =  response.data
            return  array_of_orders
        } else {
            console.error("No data found userId with given token");
            return null;
        }
    } catch (err) {
        console.error(`Error fetching user fev ids:`, err);
        return null;
    }
}

async function getOrderDetail(order_id, token){
    try {
        const url = `http://localhost:3001/v1/ordersDetail/${order_id}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data) {
            return response.data
        } else {
            console.error("No data found userId with given token");
            return null;
        }
    } catch (err) {
        console.error(`Error fetching user fev ids:`, err);
        return null;
    }
}


module.exports = {getUserOrdersByUserId,getOrderDetail}