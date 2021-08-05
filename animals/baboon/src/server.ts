import express from "express"
import { CardHandler } from './handler';

const app: express.Express = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Headers", "*");
  next();
})

app.listen(3001, () => {
  console.log("Start on port 3001.")
})

app.get('/card', CardHandler)