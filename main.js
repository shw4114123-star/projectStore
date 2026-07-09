import experss from "express"
import routerM from "./routers/router.js"
const PORT = process.env.PORT


const app = experss()

app.use(experss.json())
app.use("/router", routerM)



app.listen(PORT, ()=>{
    console.log("server runing...");
})