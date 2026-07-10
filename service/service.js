import { readcustomerFile, readOrderFile, readProductFile } from ".././readWriteData/data.js"



export async function checkQuantity(quantity) {
    if (quantity > 0) {
        return true
    } else {
        return false
    }
}


export async function checkProduct(productId, quantity) {
    try {
        const data = await readProductFile()
        const sumQuantity = await checkQuantity(quantity)
        const product = data.find(product => +product.id === productId)
        if (!product) return 404
        if (!sumQuantity) return "the quantity is less than 0"
        if (product.stock >= quantity) {
            return { "productId": product.id, "quantity": quantity }

        } else {
            return 400
        }
    } catch (e) {
        return `error: ${e}`
    }
}



export async function checkCustomerId(customerId) {
    const data = await readcustomerFile()
    const customer = data.find(customer => +customer.id === customerId)
    if (!customer) return false
    return customer
}




//     if (product.price * quantity < customer.balance) return "not enough money"
//         && product.price * quantity < customer.balance
