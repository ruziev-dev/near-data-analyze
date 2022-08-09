export enum TABLES {
  EPOCH = "EPOCH",
  VALIDATORS = "VALIDATORS",
  SERVICE = "SERVICE",
}

export const INIT = {
  EPOCH: `CREATE TABLE IF NOT EXISTS ${TABLES.EPOCH} (
	  ID TEXT UNIQUE NOT NULL PRIMARY KEY,
	  TIMESTAMP DOUBLE,
	  HEIGHT INT,
	  START_BLOCK DOUBLE,
	  LAST_BLOCK DOUBLE,
	  VALIDATORS INT,
	  SEAT_PRICE REAL,
	  AVERAGE_STAKE REAL,
	  MEDIAN_STAKE REAL,
	  GAS_PRICE REAL,
	  KICKED_OUT INT,
	  REWARD REAL
  )`,
  VALIDATORS: `CREATE TABLE IF NOT EXISTS ${TABLES.VALIDATORS} (
	  POOLNAME TEXT NOT NULL,
	  EPOCH_ID DOUBLE,
	  EXPECTED_BLOCKS INT,
	  PRODUCED_BLOCKS INT,
	  EXPECTED_CHUNKS INT,
	  PRODUCED_CHUNKS INT,
	  STAKE DOUBLE,
	  KICKEDOUT BOOLEN
  )`,
  SERVICE: `CREATE TABLE IF NOT EXISTS ${TABLES.SERVICE} (
	  	KEY TEXT UNIQUE,
		VALUE TEXT
	)`,
};
