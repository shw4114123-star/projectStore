import fsPromises from "fs/promises"



export async function readcustomerFile() {
    try {
        const data = await fsPromises.readFile("./data/customer.json", "utf-8");
        return JSON.parse(data || [])
    } catch (e) {
        console.log(e);
        return []
    }
}
export async function readOrderFile() {
    try {
        const data = await fsPromises.readFile("./data/order.json", "utf-8");
        return JSON.parse(data || [])
    } catch (e) {
        console.log(e);
        return []
    }
}
export async function readProductFile() {
    try {
        const data = await fsPromises.readFile("./data/product.json", "utf-8");
        return JSON.parse(data || [])
    } catch (e) {
        console.log(e);
        return []
    }
}


export async function writeCustomerFile(data) {
    try {
        const write = fsPromises.writeFile("./data/customer.json", JSON.stringify(data,null,4), "utf-8");
        return "succesfuly"
    } catch (e) {
        return `error: ${e}`
    }
}
export async function writeProductFile(data) {
    try {
        const allData = await readProductFile()
        allData.push(data)
        const write = fsPromises.writeFile(".././data/product.json", JSON.stringify(allData,null,4), "utf-8");
        return "succesfuly"
    } catch (e) {
        return `error: ${e}`
    }
}
export async function writeOrderFile(data) {
    try {
        const allData = await readOrderFile()
        allData.push(data)
        const write = fsPromises.writeFile(".././data/order.json", JSON.stringify(allData,null,4), "utf-8");
        return "succesfuly"
    } catch (e) {
        return `error: ${e}`
    }
}
