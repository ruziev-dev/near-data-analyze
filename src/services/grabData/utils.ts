import NearDB from "../../database/db";
import { IEpoch, IValidator } from "../../database/types";
import {
  countMedianStake,
  countAverageStake,
  countNearTokens,
  findSeatPrice,
} from "../../helpers";
import { NearAPI } from "../../NearAPI/NearApiClass";

export const getEpochInfoByBlock = async (
  nearApi: NearAPI,
  blockId: string | number | null,
  epochLength: number
) => {
  const firstEpochBlock: any = await nearApi.getBlock(blockId as number);

  const {
    current_proposals,
    current_validators,
    epoch_height,
    epoch_start_height,
    next_validators,
    prev_epoch_kickout,
  }: any = await nearApi.getValidatorsByEpoch(
    firstEpochBlock.header.epoch_id as string
  );

  const kickedOutPools = new Set<string>();
  prev_epoch_kickout?.forEach((pool: any) =>
    kickedOutPools.add(pool.account_id)
  );

  const promises = current_validators.map(async (pool: any) => {
    const validator: IValidator = {
      POOLNAME: pool.account_id,
      EPOCH_ID: firstEpochBlock.header.epoch_id,
      EXPECTED_BLOCKS: pool.num_expected_blocks,
      PRODUCED_BLOCKS: pool.num_produced_blocks,
      //@ts-ignore
      EXPECTED_CHUNKS: pool.num_expected_chunks || 0,
      //@ts-ignore
      PRODUCED_CHUNKS: pool.num_produced_chunks,
      STAKE: countNearTokens(pool.stake),
      KICKEDOUT: kickedOutPools.has(pool.account_id),
    };
    await NearDB.insertValidator(validator);
  });

  await Promise.all(promises);

  const epochData: IEpoch = {
    ID: firstEpochBlock.header.epoch_id,
    HEIGHT: epoch_height,
    GAS_PRICE: Number(firstEpochBlock.header.gas_price),
    TIMESTAMP: firstEpochBlock.header.timestamp || null,
    START_BLOCK: epoch_start_height,
    LAST_BLOCK: epoch_start_height + epochLength - 1 || null,
    VALIDATORS: current_validators.length,
    PROPOSALS: current_proposals.length,
    SEAT_PRICE: findSeatPrice(current_validators),
    MEDIAN_STAKE: countMedianStake(current_validators),
    AVERAGE_STAKE: countAverageStake(current_validators),
    KICKED_OUT: prev_epoch_kickout.length || null,
    REWARD: null,
  };

  await NearDB.insertEpoch(epochData);
  return epoch_start_height - 1;
};
