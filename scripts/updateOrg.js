import { MongoClient } from 'mongodb';
import Papa from 'papaparse';
import fs from 'fs'
import dotenv from 'dotenv';
import { parse } from 'csv-parse'

dotenv.config({ path: '../.env' });

const client = new MongoClient(process.env.PSC_CONN_STRING);
const peopleDb = client.db('people');
const orgColl = peopleDb.collection('org');

const KEY_EMAIL = 'Work email';
const KEY_MANAGER_EMAIL = 'Manager - Work email';

const keyMap = {
  'Employee': 'employee',
  'Employee name': 'employeeName',
  'First name': 'firstName',
  'Last name': 'lastName',
  'Full name': 'fullName',
  'Phone number': 'phoneNumber',
  'Is a manager': 'isManager',
  'Department': 'department',
  'Manager': 'manager',
  'Is remote': 'isRemote',
  'Title': 'title',
  'Work location address - City': 'workLocationCity',
  'Work location address - State': 'workLocationState',
  'Employee start date': 'startDate',
  'alias': 'alias',
  'Employment status': 'status',
};

function sanitizeObject(obj) {
  const sanitized = {};
  for (const key in obj) {
    let sk = key;
    if (keyMap[key]) {
      sk = keyMap[key];
    }
    sanitized[sk] = obj[key];
  }
  return sanitized;
}

async function updateRow(rowData) {
  const sanitized = sanitizeObject(rowData);
  if (sanitized.status === 'Terminated') {
    // Then only insert if the alias doesn't exist
    const existing = await orgColl.findOne({ alias: sanitized.alias });
    if (existing && existing.status != 'Terminated') {
      return;
    }
  }
  await orgColl.updateOne({ alias: sanitized.alias }, { $set: sanitized }, { upsert: true });
  // await orgColl.insertOne(sanitized);
}

function importFile(csvFile) {
  const parser = parse({ delimiter: ',', columns: true });
  const stream = fs.createReadStream(csvFile);
  stream.pipe(parser);
  parser.on('data', async (data) => {
    await importRow(data);
  });
}

function getAliasFromEmail(email) {
  return email.split('@')[0];
}

async function importRow(rowData) {
  console.log(rowData);
  const alias = getAliasFromEmail(rowData[KEY_EMAIL]);
  delete rowData[KEY_EMAIL];
  rowData.alias = alias;

  const managerAlias = getAliasFromEmail(rowData[KEY_MANAGER_EMAIL]);  
  delete rowData[KEY_MANAGER_EMAIL];
  rowData.managerAlias = managerAlias;

  console.log(rowData.Employee);
  await updateRow(rowData);
  // console.log(rowData);
}

function runScript() {
  importFile('../db/org.csv');
}

runScript();