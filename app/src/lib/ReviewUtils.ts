
import dotenv from 'dotenv';

import { AnyBulkWriteOperation, MongoClient } from 'mongodb';
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
      reviewee: 1,
      reviewer: 1,
    }).toArray();
  }

  public static async genSaveFeedbackRequests(
    requests: Array<any>,
    reports: Array<string>,
  ) {
    const existingRequests = 
      await this.genFeedbackRequests(reports.map(r => r.alias));
    console.dir(existingRequests);
    const requestsToDelete = 
      existingRequests.filter(r => !requests.find(
        r2 => r2.reviewer === r.reviewer && r2.reviewee === r.reviewee
      ));
    console.dir(requestsToDelete);
    const operations = Array<AnyBulkWriteOperation>();
    requestsToDelete.forEach(r => {
      operations.push({
        deleteOne: {
          filter: {
            reviewPeriod: REVIEW_PERIOD,
            reviewer: r.reviewer,
            reviewee: r.reviewee,
          },
        },
      });
    });
    console.log(operations);
    requests.map(r => {
      operations.push({
        updateOne: {
          filter: { 
            reviewPeriod: REVIEW_PERIOD,
            reviewer: r.reviewer,
            reviewee: r.reviewee,
          },
          update: {
            $setOnInsert: {
              reviewPeriod: REVIEW_PERIOD,
              reviewer: r.reviewer,
              reviewee: r.reviewee,
              requester: r.requester,
              requestDate: new Date(),
            },
          },
          upsert: true,
        }
      });
    });
    console.log(operations);
    await reviewsColl.bulkWrite(operations);
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