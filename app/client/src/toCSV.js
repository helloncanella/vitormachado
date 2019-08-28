const { Parser } = require("json2csv")

export default function toCSV(json) {
  const fields = ["caixa", "nome", "data"]
  const opts = { fields }

  try {
    const parser = new Parser(opts)
    const csv = parser.parse(json)
    return csv
  } catch (err) {
    console.error(err)
  }
}
