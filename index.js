const express = require('express')
const cors = require('cors')
const routes = require('./routes/routes.js')

const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
const port = 8000
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }))

app.use('/api', routes)

app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})
