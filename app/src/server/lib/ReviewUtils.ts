
import dotenv from 'dotenv';

import { AnyBulkWriteOperation, MongoClient } from 'mongodb';
import nullthrows from './nullthrows';

dotenv.config({ path: '../.env' });

const REVIEW_PERIOD = '2023Q3';
const REVIEW_REQUEST = 'request';
const REVIEW_CONTENT = 'content';
const client = new MongoClient(nullthrows(process.env.PSC_CONN_STRING));
const peopleDb = client.db('people');
const reviewsColl = peopleDb.collection('reviews');

export default abstract class ReviewUtils {
  public static async genFeedbackRequests(aliases: string[]) {
    return await reviewsColl.find({ 
      reviewPeriod: REVIEW_PERIOD,
      type: REVIEW_REQUEST,
      reviewee: { $in: aliases } 
    }).project({
      _id: 0,
      reviewee: 1,
      reviewer: 1,
    }).toArray();
  }

  public static async genSaveFeedbackRequests(
    requests: Array<any>,
    reports: Array<Record<string, any>>,
  ) {
    const existingRequests = 
      await this.genFeedbackRequests(reports.map(r => r.alias));
    const requestsToDelete = 
      existingRequests.filter(r => !requests.find(
        r2 => r2.reviewer === r.reviewer && r2.reviewee === r.reviewee
      ));
    const operations = Array<AnyBulkWriteOperation>();
    requestsToDelete.forEach(r => {
      operations.push({
        deleteOne: {
          filter: this.requestFilter(r.reviewee, r.reviewer),
        },
      });
    });
    requests.map(r => {
      operations.push({
        updateOne: {
          filter: this.requestFilter(r.reviewee, r.reviewer),
          update: {
            $setOnInsert: {
              ...this.requestFilter(r.reviewee, r.reviewer),
              requester: r.requester,
              requestDate: new Date(),
            },
          },
          upsert: true,
        }
      });
    });
    await reviewsColl.bulkWrite(operations);
  }

  public static async genSelfReview(alias: string) {
    return await reviewsColl.findOne(this.contentFilter(alias, alias));
  }

  public static async genSaveSelfReview(alias: string, contents: string) {
    return await reviewsColl.updateOne(
      this.contentFilter(alias, alias),
      {
        $set: {
          ...this.contentFilter(alias, alias),
          lastModified: new Date(),
          contents: contents,
        },
      }, 
      {
        upsert: true,
      },
    );
  }

  public static async genManagerFeedback(alias: string, manager: string) {    
    return await reviewsColl.findOne(this.contentFilter(manager, alias));
  }

  public static async genPeerFeedback(alias: string, peer: string) {
    return await reviewsColl.findOne(this.contentFilter(peer, alias));
  }

  public static async genReportReview(alias: string, report: string) {
    return await reviewsColl.findOne(this.contentFilter(report, alias));
  }

  public static async genPeerReviewList(alias: string) {
    return await reviewsColl.find({
      reviewPeriod: REVIEW_PERIOD,
      type: REVIEW_REQUEST,
      reviewer: alias,
    }).toArray();
  }

  public static async genSaveManagerFeedback(
    alias: string,
    manager: string,
    contents: string,
  ) {
    return await this.genSaveReviewContents(manager, alias, contents);
  }

  public static async genSavePeerFeedback(
    alias: string,
    peer: string,
    contents: string,
  ) {
    return await this.genSaveReviewContents(peer, alias, contents);
  }

  public static async genSaveReportReview(
    alias: string,
    report: string,
    contents: string,
  ) {
    return await this.genSaveReviewContents(report, alias, contents);
  }

  private static async genSaveReviewContents(
    reviewee: string,
    reviewer: string,
    contents: string,
  ) {
    return await reviewsColl.updateOne(
      this.contentFilter(reviewee, reviewer),
      {
        $set: {
          ...this.contentFilter(reviewee, reviewer),
          lastModified: new Date(),
          contents: contents,
        },
      }, 
      {
        upsert: true,
      },
    );
  }

  private static requestFilter(reviewee: string, reviewer: string) {
    return {
      reviewPeriod: REVIEW_PERIOD,
      type: REVIEW_REQUEST,
      reviewer: reviewer,
      reviewee: reviewee,
    };
  }

  private static contentFilter(reviewee: string, reviewer: string) {
    return {
      reviewPeriod: REVIEW_PERIOD,
      type: REVIEW_CONTENT,
      reviewer: reviewer,
      reviewee: reviewee,
    };
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