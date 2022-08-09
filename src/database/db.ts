import sqlite, { Database } from "sqlite3";
import Logger from "../services/logger";
import { INIT, TABLES } from "./tables";
import { IEpoch, IValidator } from "./types";

const errorHandler = (error: Error | null) => {
  if (error) {
    console.log("SQL DB ERROR: ", error.message);
    Logger.error(error);
  }
};

export class NearDB {
  private db: Database;
  constructor() {
    this.db = new sqlite.Database("./data.sqlite", errorHandler);
    this.db.run(INIT.EPOCH, errorHandler);
    this.db.run(INIT.SERVICE, errorHandler);
    this.db.run(INIT.VALIDATORS, errorHandler);
  }

  private async execute(query: string): Promise<void> {
    return new Promise((res, rej) => {
      this.db.exec(query, (err) => {
        errorHandler(err);
        rej(err);
      });
      res();
    });
  }

  private async get<T>(query: string): Promise<T[]> {
    return new Promise((res, rej) => {
      this.db.all(query, (err, rows) => {
        if (err) {
          errorHandler(err);
          rej(err);
        } else res(rows);
      });
    });
  }

  async insertValidator(pool: IValidator) {
    await this.execute(
      `INSERT OR IGNORE INTO ${TABLES.VALIDATORS}
        (POOLNAME, EPOCH_ID, EXPECTED_BLOCKS, PRODUCED_BLOCKS, EXPECTED_CHUNKS, PRODUCED_CHUNKS, STAKE, KICKEDOUT)
        VALUES (
          '${pool.POOLNAME}', '${pool.EPOCH_ID}', ${pool.EXPECTED_BLOCKS}, ${pool.PRODUCED_BLOCKS},
          ${pool.EXPECTED_CHUNKS}, ${pool.PRODUCED_CHUNKS}, ${pool.STAKE}, ${pool.KICKEDOUT}
        )`
    );
  }

  async getPools() {
    return await this.get(
      `SELECT POOLNAME FROM ${TABLES.VALIDATORS} GROUP BY POOLNAME ORDER BY POOLNAME ASC`
    );
  }

  async getPoolInfo(pool: string) {
    return await this.get(
      `SELECT E.TIMESTAMP, P.STAKE, P.EXPECTED_BLOCKS, P.PRODUCED_BLOCKS,
        P.EXPECTED_CHUNKS, P.PRODUCED_CHUNKS,P.KICKEDOUT, E.ID, E.HEIGHT
        FROM ${TABLES.VALIDATORS} P
          LEFT JOIN ${TABLES.EPOCH} E
          ON P.EPOCH_ID=E.ID
        WHERE P.POOLNAME = "${pool}"
        ORDER BY E.TIMESTAMP ASC`
    );
  }

  async insertEpoch(epoch: IEpoch) {
    await this.execute(
      `INSERT OR IGNORE INTO ${TABLES.EPOCH} (ID, TIMESTAMP, HEIGHT, START_BLOCK, LAST_BLOCK, VALIDATORS, SEAT_PRICE, AVERAGE_STAKE, MEDIAN_STAKE, GAS_PRICE, KICKED_OUT, REWARD)
        VALUES ('${epoch.ID}', ${epoch.TIMESTAMP}, ${epoch.HEIGHT}, ${epoch.START_BLOCK},${epoch.LAST_BLOCK}, ${epoch.VALIDATORS},
        ${epoch.SEAT_PRICE}, ${epoch.AVERAGE_STAKE}, ${epoch.MEDIAN_STAKE}, ${epoch.GAS_PRICE}, ${epoch.KICKED_OUT}, ${epoch.REWARD})`
    );
  }
  async getEpochs() {
    return await this.get(`SELECT * FROM ${TABLES.EPOCH}`);
  }

  async addSeviceData(key: string, value: string) {
    await this.execute(
      `INSERT OR REPLACE INTO ${TABLES.SERVICE} (KEY, VALUE)
        VALUES ('${key}', ${value})`
    );
  }

  async getServiceData(key: string): Promise<string | null> {
    try {
      const result = await this.get<{ KEY: string; VALUE: string }>(
        `SELECT * FROM ${TABLES.SERVICE} WHERE KEY = "${key}"`
      );
      return result[0]?.VALUE || null;
    } catch (error) {
      return null;
    }
  }
}

export default new NearDB();
