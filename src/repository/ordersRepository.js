const queryHelpers = require('../helpers').query

exports.getOrdersByID = (sql, id) => {

}

exports.getOrdersByUserID = (sql, user_id) => {
    
}

exports.getOrderListByCustomerID = (sql, customer_id, status) => {
    try {
        return sql
            .query(`
                SELECT A.id, A.customer_id, A.merchant_id, A.booking_datetime, A.status, A.created_at, A.updated_at
                , B.full_name AS "merchant_name"
                FROM orders AS A
                JOIN users AS B
                    ON A.merchant_id = B.id
                WHERE A.customer_id = $1 AND status IN(${status})
                `,
            [customer_id])
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err;
    }
}

exports.getOrderListByMerchantID = (sql, merchant_id, status) => {
    try {
        return sql
            .query(`
                SELECT A.id, A.customer_id, A.merchant_id, A.booking_datetime, A.status, A.created_at, A.updated_at
                , B.full_name
                FROM orders AS A
                JOIN users AS B
                    ON A.customer_id = B.id
                WHERE A.merchant_id = $1 AND status IN(${status})
                `,
            [merchant_id])
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err;
    }
}

exports.getOrdersByConditional = (sql, where) => {

}

exports.getOrderPetsByOrderID = (sql, order_id) => {

}

exports.getOrderPetServicesByOrderID = (sql, order_id) => {

}

exports.createOrders = async (sql, customer_id, merchant_id, booking_datetime, amount, status) => {
    try {
        return sql
            .query(
                queryHelpers
                    .insertQuery(
                        {customer_id, merchant_id, booking_datetime, amount, status}, 'orders'),
                        [customer_id, merchant_id, booking_datetime, amount, status]
            )
            .then(data => data.rows[0])
    } catch (err) {
        throw err
    }
}

exports.createOrderPet = async (sql, order_id, pet_id, amount, status) => {
    try {
        return sql
        .query(
            queryHelpers
                .insertQuery(
                    {order_id, pet_id, amount, status}, 'order_pets'),
                    [order_id, pet_id, amount, status]
        )
        .then(data => data.rows[0])
    } catch (err) {
        throw err
    }
}

exports.createOrderPetService = async (sql, order_pet_id, merchant_service_id, service_name, service_description, service_price, service_qty, status) => {
    try {
        return sql
        .query(
            queryHelpers
                .insertQuery(
                    {order_pet_id, merchant_service_id, service_name, service_description, service_price, service_qty, status}, 'order_pet_services'),
                    [order_pet_id, merchant_service_id, service_name, service_description, service_price, service_qty, status]
        )
        .then(data => data.rows[0])
    } catch (err) {
        throw err
    }
}

exports.updateStatusOrders = (sql, id, status) => {

}

exports.insertOrderPets = (sql, data) => {

}

exports.insertOrderPetServices = (sql, data) => {

}

exports.insertOrderReviews = (sql, data) => {
    
}
