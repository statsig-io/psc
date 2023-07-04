
import dotenv from 'dotenv';

import { MongoClient } from 'mongodb';
import nullthrows from './nullthrows';

dotenv.config({ path: '../.env' });

const client = new MongoClient(nullthrows(process.env.PSC_CONN_STRING));
const peopleDb = client.db('people');
const orgColl = peopleDb.collection('org');

export default abstract class OrgUtils {
  public static async genReports(manager: string) {
    return await orgColl.find({ managerAlias: manager }).project({
      _id: 0,
      alias: 1,
      managerAlias: 1,
      employeeName: 1,
    }).toArray();
  }

  public static async genAllEmployees() {
    return await orgColl.find().project({
      _id: 0,
      alias: 1,
      managerAlias: 1,
      fullName: 1,
      employeeName: 1,
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