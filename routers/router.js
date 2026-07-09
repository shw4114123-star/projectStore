import express from "express"
import { readProductFile, readcustomerFile } from ".././readWriteData/data.js"

const router = express.Router()
const products = await readProductFile()
const costumers = await readcustomerFile()
const others =
    router.get("/", (req, res) => {
        res.end("hello from API")
    })

router.get("/health", (req, res) => {
    res.end("the server working")
})


router.get("/products", (req, res) => {
    let data = products
    const { inStock, maxPrice, search } = req.query;
    if (maxPrice) {
        if (isNaN(maxPrice) || maxPrice.length <= 0) {
            res.status(400)
            return res.end(JSON.stringify({ "success": false, "message": "Error url" }))
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
        return res.end(JSON.stringify({ "success": false, "message": "Error url" }));
    }
    if (product.length === data.length && req.url.includes("?")) return res.end("not find a right query")
    return res.json(data)
})

router.get("/cart", (req, res) => {
    try {
        const { customerId } = req.query
        if (customerId) {
            const findCartById = costumers.find(costumer => costumer.customerId == customerId);
            if (findCartById) {
                const costumerCart = findCartById.cart
                return res.json(costumerCart)
            } else {
                res.status(404)
                return res.end(JSON.stringify({ "success": false, "message": "not found costumer" }))
            }
        } else {
            res.status(400)
            return res.end(JSON.stringify({ "success": false, "message": "Error url" }))
        }
    } catch (e) {
        res.end(`error: ${e}`)
    }
})


router.post("/cart/items", (req, res) => {
    const { customerId, productId, quantity } = req.body;
    if (!customerId) return


})
export default router