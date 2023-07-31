import { MongoClient } from 'mongodb';
import nullthrows from './nullthrows';
import Secrets from './secrets';

const client = new MongoClient(nullthrows(Secrets.PSC_CONN_STRING));
const peopleDb = client.db('people');
const orgColl = peopleDb.collection('org');

export default abstract class OrgUtils {
  public static async genManager(alias: string) {
    const doc = await this.genEmployee(alias);
    if (!doc?.managerAlias) {
      return null;
    }
    return await this.genEmployee(doc?.managerAlias);
  }

  public static async genEmployee(alias: string) {
    const doc = await orgColl.findOne({ alias }, {
      projection: {
        _id: 0,
        alias: 1,
        employeeName: 1,
        fullName: 1,
        managerAlias: 1,
        title: 1,
      }
    });
    return doc;
  }

  public static async genEmployeeNames(aliases: Array<string>) {
    const docs = await orgColl.find({ alias: { $in: aliases } }).project({
      _id: 0,
      alias: 1,
      employeeName: 1,
    }).toArray();
    return docs;
  }

  public static async genAllEmployees() {
    return await orgColl.find({
      status: 'Active',
    }).project({
      _id: 0,
      alias: 1,
      managerAlias: 1,
      fullName: 1,
      employeeName: 1,
    }).toArray();
  }

  public static async genReports(manager: string) {
    return await orgColl.find({
      managerAlias: manager,
      status: 'Active',
    }).project({
      _id: 0,
      alias: 1,
      managerAlias: 1,
      employeeName: 1,
    }).toArray();
  }
}
