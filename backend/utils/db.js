import mongoose from "mongoose";

const connectDB = async () => {
    try {
		if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
		const uri = process.env.MONGO_URI;

		// Enable stricter query parsing and clearer deprecation behavior
		mongoose.set('strictQuery', true);

		// Helpful diagnostics for common Atlas misconfigurations
		if (uri.startsWith('mongodb://') && uri.includes('mongodb.net') && !uri.includes('replicaSet=')) {
			console.warn('[MongoDB] Detected non-SRV Atlas URI without replicaSet/SSL params. ' +
				'Consider using the SRV URI (mongodb+srv://...) or add ?ssl=true&replicaSet=<name>&authSource=admin&retryWrites=true&w=majority');
		}

		const serverSelectionTimeoutMs = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 30000;
		const connectTimeoutMs = Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 30000;

		await mongoose.connect(uri, {
			serverSelectionTimeoutMS: serverSelectionTimeoutMs,
			connectTimeoutMS: connectTimeoutMs,
			// Use MongoDB Stable API (recommended for Atlas)
			serverApi: { version: '1', strict: true, deprecationErrors: true }
		});

		console.log('MongoDB connected successfully');

		mongoose.connection.on('disconnected', () => {
			console.error('[MongoDB] Disconnected from database');
		});
		mongoose.connection.on('error', (err) => {
			console.error('[MongoDB] Connection error:', err);
		});
    } catch (error) {
		console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
export default connectDB;