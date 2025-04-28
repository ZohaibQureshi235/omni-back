import express from 'express'
import cors from 'cors'
import routes from './src/routes.js'
import connectDB from './config/connectdb.js'

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

connectDB()
const port = 8000
app.use(cors({ origin: ['http://localhost:3000', 'https://omni-verse-y9my.vercel.app', 'https://omni-back-pearl.vercel.app', 'https://zohaib-qureshi235-wall-paper-qureshi-admin-panel-adsense.vercel.app'], methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }))

app.use('/api', routes)

app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})
