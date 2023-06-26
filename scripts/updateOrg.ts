import BetterSqlite3 from 'better-sqlite3';
import AssocTypes from './assocs';
import Papa from 'papaparse';
import fs from 'fs'

let peopleDb: BetterSqlite3.Database | null = null;

function createOrgTable(): boolean {
  const tableName = 'org';
  try {
    peopleDb?.exec(`
      CREATE TABLE IF NOT EXISTS ${tableName} (unit TEXT, listname TEXT);
      CREATE INDEX IF NOT EXISTS ${tableName}_index ON ${tableName} (unit);
    `);
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
}

function importFile(csvFile: string) {
  const stream = fs.createReadStream(csvFile);
  Papa.parse(stream, {
    header: true,
    step: (results: any) => {
      importRow(results.data);
    }
  });
}

function importRow(rowData: Record<string, string>) {
  console.log(rowData);
}

function runScript() {
  console.log(process.argv);
  if (process.argv.length < 3) {
    console.log('Need csv file as import source');
    return;
  }

  peopleDb = new BetterSqlite3('../db/people.db');
  createOrgTable();
  importFile(process.argv[2]);
}

runScript();