const express = require('express')
const routes = require('./routes/routes.js')
const connectDB = require('./config/connectdb.js')
const cors = require('cors')

const app = express()
connectDB()
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true
	})
)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/', routes)

app.listen(8000, () => {
	console.log('port is running')
})
