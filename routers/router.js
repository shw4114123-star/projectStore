import express from "express"
import { readProductFile, readcustomerFile, readOrderFile, writeCustomerFile } from ".././readWriteData/data.js"
import { checkProduct, checkCustomerId } from ".././service/service.js"

const router = express.Router()
const products = await readProductFile()
const customers = await readcustomerFile()
const orders = await readOrderFile()

router.get("/", (req, res) => {
    try {
        res.end("hello from API")
    } catch (e) {
        res.status(500)
        return res.json({ "success": false, "message": `erorr: ${e}` })
    }
})

router.get("/health", (req, res) => {
    try {
        res.end("the server working")
    } catch (e) {
        res.status(500)
        return res.json({ "success": false, "message": `erorr: ${e}` })
    }
})


router.get("/products", (req, res) => {
    try {
        let data = products
        const { inStock, maxPrice, search } = req.query;
        if (maxPrice) {
            if (isNaN(maxPrice) || maxPrice.length <= 0) {
                res.status(400)
                return res.json({ "success": false, "message": "Error url" })
            }
            data = data.filter(product => +product.price <= maxPrice);
        }
        if (search) {
            data = data.filter(product => product.name.includes(search));
        }
        if (inStock === "true") {
            data = data.filter(product => +product.stock > 0);
        }
        if (inStock && inStock !== "true") {
            res.status(400)
            return res.json({ "success": false, "message": "Error url" });
        }
        if (product.length === data.length && req.url.includes("?")) return res.end("not find a right query")
        return res.json(data)
    } catch (e) {
        res.status(500)
        return res.json({ "success": false, "message": `erorr: ${e}` })
    }
})


router.get("/cart", (req, res) => {
    try {
        const { customerId } = req.query
        if (customerId) {
            const findCartById = customers.find(customer => customer.customerId === customerId);
            if (findCartById) {
                const customerCart = findCartById.cart
                return res.json(customerCart)
            } else {
                res.status(404)
                return res.json({ "success": false, "message": "not found customer" })
            }
        } else {
            res.status(400)
            return res.json({ "success": false, "message": "Error url" })
        }
    } catch (e) {
        res.status(500)
        return res.json({ "success": false, "message": `erorr: ${e}` })
    }
})


router.get("/account/balance", async (req, res) => {
    try {
        const customersData = await readcustomerFile()
        const { customerId } = req.query
        if (!customerId) {
            res.status(400)
            return res.json({ "success": false, "message": "wrong url" })
        }
        const customer = customersData.find(customer => customer.customerId === customerId)
        if (!customer) {
            res.status(404)
            return res.json({ "success": false, "message": "customer not found" })
        }
        return res.json({ "success": true, "data": `balence: ${customer.balance}` })
    } catch (e) {
        res.status(500)
        return res.json({ "success": false, "message": `erorr: ${e}` })
    }
})


router.post("/cart/items", async (req, res) => {
    try {
        const { customerId, productId, quantity } = req.body;
        const checkCustomer = await checkCustomerId(customerId)
        if (!customerId || !checkCustomer) {
            res.status(400)
            return res.json({ "success": false, "message": "Error message" });
        }
        if (!productId) {
            res.status(400)
            return res.json({ "success": false, "message": "Error message" });
        }
        if (!quantity) {
            res.status(400)
            return res.json({ "success": false, "message": "Error message" })
        };
        const checkProducts = await checkProduct(productId, quantity)
        return res.json({ "success": true, "data": checkProducts });
    } catch (e) {
        res.status(500)
        return res.json({ "success": false, "message": `erorr: ${e}` })
    }
})


router.delete("/cart/items/:productId", async (req, res) => {
    try {
        const customerData = await readcustomerFile()
        const { productId } = req.params
        const { customerId } = req.body
        const finallyCustomerData = customerData.map(customer => {
            if (customer.customerId !== customerId) {
                res.status(404)
                return res.json({ "success": false, "message": "customer not found" })
            }
            if (customer.customerId === customerId) {
                customer.cart = customer.cart.filter(item => item.productId !== productId)
            }
            return customer
        })
        await writeCustomerFile(finallyCustomerData)
        return res.end("the product deleted succesfuly.")
    } catch (e) {
        res.status(500)
        return res.json({ "success": false, "message": `erorr: ${e}` })
    }
})


router.get("/ordrs", async (req, res) => {
    try {
        const { customerId } = req.query
        if (!customerId) {
            res.status(400)
            res.json({ "success": false, "message": "wrong url" })
        }
        const findOrder = orders.find(order => order.customerId === customerId)
        if (!findOrder) {
            res.status(404)
            return res.json({ "success": false, "message": "customer not found" })
        }
        const items = findOrder.items
        return res.json({ "success": true, "data": items })
    } catch (e) {
        res.status(500)
        return res.json({ "success": false, "message": `erorr: ${e}` })
    }
})


export default router