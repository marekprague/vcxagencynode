/**
 * Copyright 2020 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

/* eslint-env jest */
const uuid = require('uuid')
const { createTestPgDb } = require('../../pg-tmpdb')
const { createPgStorageEntities } = require('../../../src/service/storage/pgstorage-entities')
// const util = require('util')
// const pgtools = require('pgtools')

beforeAll(async () => {
  jest.setTimeout(1000 * 300)
})

let tmpPgDb
beforeEach(async () => {
  tmpPgDb = await createTestPgDb()
})

afterEach(async () => {
  // Following fails because connection is still open from storage object
  // any idea how to close it without adding methods to its api?
  // await tmpPgDb.dropDb()
})

// async function dropDb (user, password, host, port, dbName) {
//   let dropPgDbAsync = util.promisify(pgtools.dropdb)
//   await dropPgDbAsync({ user, password, host, port }, dbName)
// }

describe('storage', () => {
  it('should save and load entity record', async () => {
    const pgStorage = await createPgStorageEntities(tmpPgDb.info)
    const entityDid = uuid.v4()
    const entityVerkey = uuid.v4()
    await pgStorage.saveEntityRecord(entityDid, entityVerkey, { foo: 'foo1' })
    await pgStorage.saveEntityRecord(uuid.v4(), uuid.v4(), { foo: 'foo2' })
    const entityByDid = await pgStorage.loadEntityRecord(entityDid)
    expect(entityByDid.foo).toBe('foo1')
  })
})
