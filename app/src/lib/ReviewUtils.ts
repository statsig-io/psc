
import dotenv from 'dotenv';

import { MongoClient } from 'mongodb';
import nullthrows from './nullthrows';

dotenv.config({ path: '../.env' });

const REVIEW_PERIOD = '2023Q3';
const client = new MongoClient(nullthrows(process.env.PSC_CONN_STRING));
const peopleDb = client.db('people');
const reviewsColl = peopleDb.collection('reviews');

export default abstract class ReviewUtils {
  public static async genFeedbackRequests(aliases: string[]) {
    return await reviewsColl.find({ 
      reviewPeriod: REVIEW_PERIOD,
      reviewee: { $in: aliases } 
    }).project({
      _id: 0,
      revieweeAlias: 1,
      reviewerAlias: 1,
    }).toArray();
  }
}

/*

perf.db

cycle_table
-----------
cycle_id is_active details


requests_table
--------------
cycle_id timestamp reviewer reviewee requester


reviews_table
-------------
review_id request_id timestamp is_shared details is_open


id assoc metadata value

cycle_id CYCLE_DETAILS is_active {...}


*/