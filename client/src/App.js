import { QRCode } from "react-qr-svg"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import moment from "moment"
import React from "react"
import { CsvToHtmlTable } from "react-csv-to-table"
import _ from "lodash"

import "./App.css"
import toCSV from "./toCSV"

const isProduction = process.env.NODE_ENV === "production"

const host = isProduction
  ? "https://vitormachado.herokuapp.com"
  : "http://localhost:3015"

async function fetchTable() {
  return fetch(`${host}/fetchTable`)
    .then(res => res.json())
    .then(r =>
      r
        .sort((a, b) => {
          if (new Date(b.data) > new Date(a.data)) return 1
          return -1
        })
        .map(a => ({
          ..._.omit(a, "data"),
          data: moment(a.data).format("DD/MM/YY [às] HH:mm")
        }))
    )
}

function Table() {
  const [table, setTable] = React.useState(null)

  React.useEffect(() => {
    fetchTable().then(setTable)
  }, [])

  if (!table) return <h3>Carregando tabela</h3>

  const link = getLink(table)

  return (
    <div
      style={{
        maxWidth: 1024,
        margin: "50px auto",
        textAlign: "center",
        maxHeight: "90vh",
        overflow: "auto"
      }}
    >
      <CsvToHtmlTable
        data={toCSV(table).replace(/"/g, "")}
        csvDelimiter=","
        tableClassName="table table-striped table-hover"
      />
      <a href={link} download="tabela.csv">
        Baixar
      </a>
    </div>
  )
}

function getLink(table) {
  let csvContent =
    "data:text/csv;charset=utf-8," +
    [_.keys(table[0]), ...table].map(e => _.values(e).join(",")).join("\n")

  var encodedUri = encodeURI(csvContent)

  return encodedUri
}

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h1 style={{ margin: 0, fontSize: "15rem" }}>404</h1>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/qrcode/caixa/:caixaID" component={QrCode} exact></Route>
        <Route path="/tabela" component={Table}></Route>
        <Route component={NotFound}></Route>
      </Switch>
    </Router>
  )
}

function QrCode({ match }) {
  const {
    params: { caixaID }
  } = match

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <h1 style={{ marginBottom: 25 }}>{`Caixa ${caixaID}`}</h1>
      <QRCode
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="Q"
        style={{ width: 256 }}
        value={`${host}/registro?nome=Vitor&caixa=${caixaID}`}
      />
    </div>
  )
}
