const helpers = require('../helpers')
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

        console.log('Push notification to merchant')
        const userMerchants = await repository.merchants.getMerchantsByID(sql, merchant_id)
        const merchantUserTokens = await repository.users.getActiveUserTokenByUserID(sql, userMerchants.user_id)
        const tokens = []
        for (const userToken of merchantUserTokens) {
            tokens.push(userToken.token)
        }
        const message = {
            notification: {
                title: 'Anda mendapatkan pesanan baru.',
                body: 'Anda mendapatkan pesanan baru.'
            },
            data: {
                order_id: String(data.orders.id),
                screen: 'Order_Coming_Detail_Merchant'
            }
        }
        const options = { priority: 'high' }
        try {
            await helpers.notification.sendPushNotification(tokens, message, options)
        } catch (err) {
            console.log('Error on Push Notification when createOrders => ', err)
        }
        console.log('Done pushing notification to merchant')

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
                
                console.log('Push notification to customer')
                const userTokens = await repository.users.getActiveUserTokenByUserID(sql, orders.customer_id)
                const tokens = []
                for (const userToken of userTokens) {
                    tokens.push(userToken.token)
                }
                const message = {}
                message.data = {
                    order_id: String(id)
                }
                switch (status) {
                    case 2:
                        message.notification = {
                            title: 'Pesanan anda telah diterima oleh veterinarian.',
                            body: 'Pesanan anda telah diterima oleh veterinarian.'
                        }
                        message.data.screen = 'ORDER_DETAIL_CUSTOMER'
                    case 3:
                        message.notification = {
                            title: 'Pesanan anda telah ditolak oleh veterinarian.',
                            body: 'Pesanan anda telah ditolak oleh veterinarian.'
                        }
                        message.data.screen = 'Order_History_Detail_Customer'
                    case 4:
                        message.notification = {
                            title: 'Pesanan anda telah diprogress oleh veterinarian.',
                            body: 'Pesanan anda telah diprogress oleh veterinarian.'
                        }
                        message.data.screen = 'ORDER_DETAIL_CUSTOMER'
                    case 5:
                        message.notification = {
                            title: 'Pesanan anda telah diselesaikan oleh veterinarian.',
                            body: 'Pesanan anda telah diselesaikan oleh veterinarian, silahkan memberikan ratings.'
                        }
                        message.data.screen = 'Order_History_Detail_Customer'
                }
                const options = { priority: 'high' }
                try {
                    await helpers.notification.sendPushNotification(tokens, message, options)
                } catch (err) {
                    console.log('Error on Push Notification when updateStatusOrder => ', err)
                }
                console.log('Done pushing notification to customer')

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

// exports.updateTreatmentOrders = async (sql, merchant_id, created, updated, deleted, unique_order_pet_id) => {
//     console.log('SERVICES - updateTreatmentOrders', {merchant_id, created, updated, deleted, unique_order_pet_id})
//     const result = {}

//     console.log('Checking deleted order_pet_service_id is exists')
//     for (const del of deleted) {
//         const order_pet_services = await repository.orders.getOrderPetServicesByID(sql, del)
//         if (!order_pet_services) {
//             return { deletedOrderPetServiceIDNotFound: true, orderPetServiceID: del }
//         }

//         if (!unique_order_pet_id.includes(order_pet_services.order_pet_id)) {
//             console.log('unique order_pet_id: ', order_pet_services.order_pet_id)
//             unique_order_pet_id.push(order_pet_services.order_pet_id)
//         }
//     }

//     let order_id = 0

//     console.log('Checking unique order_pet_id is belong to merchant_id')
//     for (const order_pet_id of unique_order_pet_id) {
//         console.log('order_pet_id: ', order_pet_id)
//         const orders = await repository.orders.getOrdersByOrderPetIDAndMerchantID(sql, order_pet_id, merchant_id)
//         console.log('Orders: ', orders)
//         if (!orders) {
//             return { ordersNotBelongToMerchant: true }
//         }
//         order_id = orders.order_id
//     }

//     console.log('Create Order Pet Services')
//     for (const create of created) {
//         console.log('OrderPetService: ', create)
//         const order_pet_services = await repository.orders.createOrderPetService(sql, create.order_pet_id, create.merchant_service_id, create.service_name, create.service_description, create.service_price, create.service_qty, 1)

//     }

//     console.log('Update Order Pet Services')
//     for (const update of updated) {
//         console.log('OrderPetService: ', update)
//         const id = update.id
//         delete update.id
//         const order_pet_services = await repository.orders.updateOrderPetServices(sql, id, update)
//     }

//     console.log('Delete Order Pet Service')
//     for (const del of deleted) {
//         const order_pet_service = await repository.orders.updateOrderPetServices(sql, del, {status: 0})

//     }

//     console.log('Updating Total Amount Order Pets')
//     for (const order_pet_id of unique_order_pet_id) {
//         const order_pet_services = await repository.orders.getOrderPetServicesByOrderPetID(sql, order_pet_id)
//         const totalAmount = order_pet_services.reduce((acc, curr) => acc += (curr.service_price * curr.service_qty), 0)
//         const update_order_pet_services = await repository.orders.updateOrderPets(sql, order_pet_id, {amount: totalAmount})
//     }
    
//     console.log('Updating Total Amount Orders')
//     const order_pets = await repository.orders.getOrderPetsByOrderID(sql, order_id)
//     const totalAmount = order_pets.reduce((acc, curr) => acc += curr.amount, 0)
//     const update_orders = await repository.orders.updateOrders(sql, order_id, {amount: totalAmount})

//     return 1
// }

/**
 * 
 */
exports.createOrderPetServices = async (sql, merchant_id, orderId, orderPetId, data) => {
    console.log('SERVICES - createOrderPetServices', { merchant_id, orderId, orderPetId, data })

    console.log('Checking if Order Belong to Merchant')
    const checkOrders = await repository.orders.getOrdersByOrderPetIDAndMerchantID(sql, orderPetId, merchant_id)
    if (!checkOrders) {
        return { ordersNotBelongToMerchant: true }
    }

    console.log('Checking if order_pets exists')
    const checkOrderPets = await repository.orders.getOrderPetsByID(sql, orderPetId)
    if (!checkOrderPets) {
        return { ordersPetsNotFound: true }
    }

    console.log('Creating order_pet_services')
    await repository.orders.createOrderPetService(
        sql,
        data.order_pet_id,
        data.merchant_service_id,
        data.service_name,
        data.service_description,
        data.service_price,
        data.service_qty,
        1
    )

    console.log('Recalculating order_pets')
    const allOrderPetServices = await repository.orders.getOrderPetServicesByOrderPetID(sql, orderPetId)
    const orderPetsTotalAmount = allOrderPetServices.reduce((acc, curr) => acc += (curr.service_price * curr.service_qty), 0)
    await repository.orders.updateOrderPets(sql, orderPetId, { amount: orderPetsTotalAmount })

    console.log('Recalculating orders')
    const allOrderPets = await repository.orders.getOrderPetsByOrderID(sql, orderId)
    const ordersTotalAmount = allOrderPets.reduce((acc, curr) => acc += curr.amount, 0)
    await repository.orders.updateOrders(sql, orderId, { amount: ordersTotalAmount })

    return 1
}

/**
 * 
 */
exports.updateOrderPetServices = async (sql, merchant_id, orderId, orderPetId, orderPetServiceId, qty) => {
    console.log('SERVICES - updateOrderPetServices', { merchant_id, orderId, orderPetId, orderPetServiceId, qty })

    console.log('Checking if Order Belong to Merchant')
    const checkOrders = await repository.orders.getOrdersByOrderPetIDAndMerchantID(sql, orderPetId, merchant_id)
    if (!checkOrders) {
        return { ordersNotBelongToMerchant: true }
    }

    console.log('Checking if order_pets exists')
    const checkOrderPets = await repository.orders.getOrderPetsByID(sql, orderPetId)
    if (!checkOrderPets) {
        return { ordersPetsNotFound: true }
    }

    console.log('Checking if order_pet_services exists')
    const checkOrderPetServices = await repository.orders.getOrderPetServicesByID(sql, orderPetServiceId)
    if (!checkOrderPetServices) {
        return { orderPetServicesNotFound: true }
    }

    console.log('Updating order_pet_services')
    await repository.orders.updateOrderPetServices(sql, orderPetServiceId, { service_qty: qty })

    console.log('Recalculating order_pets')
    const allOrderPetServices = await repository.orders.getOrderPetServicesByOrderPetID(sql, orderPetId)
    const orderPetsTotalAmount = allOrderPetServices.reduce((acc, curr) => acc += (curr.service_price * curr.service_qty), 0)
    await repository.orders.updateOrderPets(sql, orderPetId, { amount: orderPetsTotalAmount })

    console.log('Recalculating orders')
    const allOrderPets = await repository.orders.getOrderPetsByOrderID(sql, orderId)
    const ordersTotalAmount = allOrderPets.reduce((acc, curr) => acc += curr.amount, 0)
    await repository.orders.updateOrders(sql, orderId, { amount: ordersTotalAmount })

    return 1
}

/**
 * 
 */
exports.deleteOrderPetServices = async (sql, merchant_id, orderId, orderPetId, orderPetServiceId) => {
    console.log('SERVICES - deleteOrderPetServices', { merchant_id, orderId, orderPetId, orderPetServiceId })

    console.log('Checking if Order Belong to Merchant')
    const checkOrders = await repository.orders.getOrdersByOrderPetIDAndMerchantID(sql, orderPetId, merchant_id)
    if (!checkOrders) {
        return { ordersNotBelongToMerchant: true }
    }

    console.log('Checking if order_pets exists')
    const checkOrderPets = await repository.orders.getOrderPetsByID(sql, orderPetId)
    if (!checkOrderPets) {
        return { ordersPetsNotFound: true }
    }

    console.log('Checking if order_pet_services exists')
    const checkOrderPetServices = await repository.orders.getOrderPetServicesByID(sql, orderPetServiceId)
    if (!checkOrderPetServices) {
        return { orderPetServicesNotFound: true }
    }

    console.log('Deleting order_pet_services')
    await repository.orders.updateOrderPetServices(sql, orderPetServiceId, { status: 0 })

    console.log('Recalculating order_pets')
    const allOrderPetServices = await repository.orders.getOrderPetServicesByOrderPetID(sql, orderPetId)
    const orderPetsTotalAmount = allOrderPetServices.reduce((acc, curr) => acc += (curr.service_price * curr.service_qty), 0)
    await repository.orders.updateOrderPets(sql, orderPetId, { amount: orderPetsTotalAmount })

    console.log('Recalculating orders')
    const allOrderPets = await repository.orders.getOrderPetsByOrderID(sql, orderId)
    const ordersTotalAmount = allOrderPets.reduce((acc, curr) => acc += curr.amount, 0)
    await repository.orders.updateOrders(sql, orderId, { amount: ordersTotalAmount })

    return 1
}
