const queryHelpers = require('../helpers').query

exports.getOrdersByID = (sql, id) => {
    try {
        return sql
            .query('SELECT * FROM orders WHERE id = $1', [id])
            .then(data => data.rows ? data.rows[0] : null)
    } catch (err) {
        throw err
    }
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
    try {
        return sql
            .query('SELECT * FROM order_pets WHERE order_id = $1', [order_id])
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err
    }
}

exports.getOrderPetServicesByOrderPetID = (sql, order_pet_id) => {
    try {
        return sql
            .query('SELECT * FROM order_pet_services WHERE order_pet_id = $1', [order_pet_id])
            .then(data => data.rows ? data.rows : [])
    } catch (err) {
        throw err
    }
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
    try {
        return sql
            .query(queryHelpers.updateQuery({status}, 'orders', {id}), [status])
    } catch (err) {
        throw err
    }
}

exports.insertOrderReviews = (sql, order_id, rating, description) => {
    try {
        return sql
            .query(
                queryHelpers
                    .insertQuery(
                        {order_id, rating, description}, 'order_reviews'),
                        [order_id, rating, description]
            )
            .then(data => data.rows[0])
    } catch (err) {
        throw err
    }
}

exports.getOrderReviewsByOrderID = (sql, order_id) => {
    try {
        return sql
            .query('SELECT * FROM order_reviews WHERE order_id = $1', [order_id])
            .then(data => data.rows && data.rows.length != 0 ? data.rows : null)
    } catch (err) {
        throw err
    }
}
