import express, { json, urlencoded, Request,Response } from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

app.get("/", (req:Request, res:Response) => {
  res.send("Songs API root")
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`)
});
