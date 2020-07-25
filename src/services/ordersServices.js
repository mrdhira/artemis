const repository = require('../repository');
const { ORDER_STATUS } = require('../models/orders');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getOrderList = async (sql, id, user_type) => {
    if (user_type == 1) {
        const ongoing = await repository.orders.getOrderListByCustomerID(sql, id, '1, 2, 4')
        const history = await repository.orders.getOrderListByCustomerID(sql, id, '3, 5')
        return { ongoing, history }
    } else {
        const incoming = await repository.orders.getOrderListByMerchantID(sql, id, '1')
        const ongoing = await repository.orders.getOrderListByMerchantID(sql, id, '2, 4')
        const history = await repository.orders.getOrderListByMerchantID(sql, id, '3, 5')
        return { incoming, ongoing, history }
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getOrdersDetail = async (sql, id) => {
    try {
        const orders = await repository.orders.getOrdersByID(sql, id)
        if (!orders) {
            return { ordersNotFound: true }
        } else {
            orders.order_pets = []
            const order_pets = await repository.orders.getOrderPetsByOrderID(sql, orders.id)
            for (const order_pet of order_pets) {
                order_pet_services = await repository.orders.getOrderPetServicesByOrderPetID(sql, order_pet.id)
                orders.order_pets.push({
                    ...order_pet,
                    order_pet_services
                })
            }
            const reviews = await repository.orders.getOrderReviewsByOrderID(sql, orders.id)
            orders.reviews = reviews ? reviews : {}
            return orders
        }
    } catch (err) {
        throw err
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.createOrders = async (sql, id, merchant_id, booking_datetime, pets) => {
    console.log('===============')
    console.log('Starting creating order...')
    const data = {};

    let totalAmount = 0
    for (const pet of pets) {
        for (const service of pet.services) {
            totalAmount += (service.service_price * service.service_qty)
        }
    }
    console.log('---------------')
    console.log('Total Amount: ' + totalAmount)

    try {
        data.orders = await repository.orders.createOrders(sql, id, merchant_id, booking_datetime, totalAmount, ORDER_STATUS.CUSTOMER_INITIATED);
        console.log('---------------')
        console.log('Orders: ', data.orders);

        data.order_pets = []
        for (const pet of pets) {
            console.log('---------------')
            console.log('PET: ', pet)

            const order_pet_amount = pet.services.reduce((acc, curr) => acc += (curr.service_price * curr.service_qty), 0)
            console.log('---------------')
            console.log('Total Pet Order Amount: ', order_pet_amount);

            const order_pet = await repository.orders.createOrderPet(sql, data.orders.id, pet.id, order_pet_amount, 1)
            console.log('---------------')
            console.log('Order Pet: ', order_pet);

            const order_pet_services = []
            for (const service of pet.services) {
                console.log('---------------')
                console.log('Service: ', service);

                const order_pet_service = await repository.orders
                    .createOrderPetService(
                        sql,
                        order_pet.id,
                        service.merchant_service_id,
                        service.service_name,
                        service.service_description,
                        service.service_price,
                        service.service_qty,
                        1
                    )
                console.log('---------------')
                console.log('Order Pet Service: ', order_pet_service);

                order_pet_services.push(order_pet_service)
            }
            data.order_pets.push({
                ...order_pet,
                order_pet_services
            })
        }

        console.log('Result: ', data)
        console.log('Done')
        console.log('===============')

        return data
    } catch (err) {
        throw err
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updateStatusOrders = async (sql, id, status) => {
    try {
        const orders = await repository.orders.getOrdersByID(sql, id)
        if (!orders) {
            return { ordersNotFound: true }
        } else {
            console.log(`Checking orders status condition: Orders Status: ${orders.status}, Status: ${status}`)
            if (orders.status === 3 || orders.status === 5) {
                return { ordersCompleted: true }
            } else if (
                (orders.status === 1 && (status !== 2 && status !== 3))
                || (orders.status === 2 && status !== 4)
                || (orders.status === 4 && status !== 5)
            ) {
                return { ordersStatusInvalid: true}
            } else {
                await repository.orders.updateStatusOrders(sql, id, status)
                return 1
            }
        }
    } catch (err) {
        throw err
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.addPetMedicalRecords = async (sql) => {
    return 1
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.giveOrdersRatings = async (sql, order_id, rating, description) => {
    try {
        const orders = await repository.orders.getOrdersByID(sql, order_id)
        if (!orders) {
            return { ordersNotFound: true }
        } else {
            if (orders.status !== 5) {
                return { ordersNotCompleted: true }
            } else {
                const getReviews = await repository.orders.getOrderReviewsByOrderID(sql, order_id)
                console.log('Get Reviews: ', getReviews)
                if (getReviews) {
                    return { alreadyGiven: true }
                } else {
                    await repository.orders.insertOrderReviews(sql, order_id, rating, description)
                    return 1
                }
            }
        }
    } catch (err) {
        throw err
    }
}
