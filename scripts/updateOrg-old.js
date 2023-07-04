import BetterSqlite3 from 'better-sqlite3';
import Papa from 'papaparse';
import fs from 'fs'

let peopleDb = null;

const KEY_EMAIL = 'Work email';
const KEY_MANAGER_EMAIL = 'Manager - Work email';
const ASSOC_SELF = 1;
const ASSOC_MANAGER = 2;

function createOrgTable() {
  const tableName = 'org';
  try {
    peopleDb?.exec(`
      CREATE TABLE IF NOT EXISTS ${tableName} (alias TEXT, assoc INTEGER, value TEXT);
      CREATE INDEX IF NOT EXISTS ${tableName}_index ON ${tableName} (alias);
    `);
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
}

function updateAssoc(alias, assoc, value) {
  peopleDb.prepare(
    `DELETE FROM org WHERE alias=@alias AND assoc=${assoc}`
  ).run({ alias });
  peopleDb.prepare(
    `INSERT INTO org (alias, assoc, value) VALUES (@alias, @assoc, @value)`
  ).run({
    alias,
    assoc,
    value,
  });
}

function updateSelfRow(alias, rowData) {
  updateAssoc(alias, ASSOC_SELF, JSON.stringify(rowData));
}

function updateManagerRow(alias, managerAlias) {
  updateAssoc(alias, ASSOC_MANAGER, managerAlias);
}

function importFile(csvFile) {
  const stream = fs.createReadStream(csvFile);
  Papa.parse(stream, {
    header: true,
    step: (results) => {
      importRow(results.data);
    }
  });
}

function getAliasFromEmail(email) {
  return email.split('@')[0];
}

function importRow(rowData) {
  const alias = getAliasFromEmail(rowData[KEY_EMAIL]);
  const managerAlias = getAliasFromEmail(rowData[KEY_MANAGER_EMAIL]);

  console.log(alias);
  console.log(managerAlias);
  updateSelfRow(alias, rowData);
  updateManagerRow(alias, managerAlias);
  // console.log(rowData);
}

function runScript() {
  console.log(process.argv);
  // if (process.argv.length < 3) {
  //   console.log('Need csv file as import source');
  //   return;
  // }

  peopleDb = new BetterSqlite3('../db/people.db');
  createOrgTable();
  importFile('../db/org.csv');
}

runScript();