import fs from "fs"
import http from "http"
import express from "express"
import path from "path"
import _ from "lodash"
import cors from "cors"
import toCSV from "./server/toCSV/toCSV"

const PORT = process.env.PORT || process.env.DEV_PORT || 3015
const app = express()

const httpServer = http.createServer(app)

app.use(cors())

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")))

console.log(path.join(__dirname, "client/build"))

const dataFilePath = path.join(__dirname, "./server/data/data.json")

app.get("/fetchTable", async (req, res) => {
  // console.log( const path = "./server/data/data.json")
  res.json(require(dataFilePath))
})

app.get("/registro", async (req, res) => {
  const { caixa, nome } = req.query

  if (!nome) {
    res.end("<h1 style='color:red'>Faltando o nome!</h1>")
    return
  }

  if (!caixa) {
    res.end("<h1 style='color:red'>Faltando o numero da caixa!</h1>")
    return
  }

  const lines = require(dataFilePath)

  lines.push({
    ..._.pick(req.query, ["nome", "caixa"]),
    data: new Date().toISOString()
  })

  fs.writeFileSync(dataFilePath, JSON.stringify(lines))

  return res.end(`<h1>Registrada caixa ${caixa} com sucesso!</h1>`)
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"))
})

httpServer.listen(PORT, () => {
  console.log(`🚀  Server ready at http://localhost:${PORT}`)
})
