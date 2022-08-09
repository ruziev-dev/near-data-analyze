export interface IEpoch {
  ID: string;
  TIMESTAMP: number | null;
  HEIGHT: number | null;
  START_BLOCK: number | null;
  LAST_BLOCK: number | null;
  VALIDATORS: number | null;
  SEAT_PRICE: number | null;
  AVERAGE_STAKE: number | null;
  MEDIAN_STAKE: number | null;
  GAS_PRICE: number | null;
  KICKED_OUT: number | null;
  REWARD: number | null;
}

export interface IValidator {
  POOLNAME: string;
  EPOCH_ID: string;
  EXPECTED_BLOCKS: number;
  PRODUCED_BLOCKS: number;
  EXPECTED_CHUNKS: number;
  PRODUCED_CHUNKS: number;
  STAKE: number;
  KICKEDOUT: boolean;
}
