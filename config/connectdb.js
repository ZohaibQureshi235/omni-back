import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		await mongoose.connect('mongodb+srv://iamzohaib:Zq%40%40%4012345@omniverse.ltzhvf1.mongodb.net/')
		console.log(`✅ MongoDB Connected`)
	} catch (error) {
		console.error(`❌ MongoDB connection error: ${error.message}`)
		process.exit(1) // exit with failure
	}
}

export default connectDB
