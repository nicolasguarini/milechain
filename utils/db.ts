import { MongoClient, Db } from 'mongodb';

class MongoDatabase {
  private static instance: MongoDatabase;
  private client: MongoClient;

  private constructor() {
    const url: string = process.env.DB_CONN_STRING!;
    this.client = new MongoClient(url);
    this.client.connect().catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
  }

  public static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }

  public getClient(): MongoClient{
    return this.client;
  }
}

export default MongoDatabase;
