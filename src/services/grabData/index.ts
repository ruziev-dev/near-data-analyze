import NearDB from "../../database/db";
import { NearAPI } from "../../NearAPI/NearApiClass";
import Logger from "../logger";
import { getEpochInfoByBlock } from "./utils";

const NEED_SINK = "NEED_SINK";
const LAST_EPOCH_END_BLOCK = "LAST_EPOCH_END_BLOCK";

/* It have to be  0 to iter under 0 but there are troubles about blocks below 9820213*/
const LAST_GOOD_BLOCK_HEIGHT = 9820213;

export const grabDataService = async (
  NETWORK: string,
  NODE_IP: string,
  ARCHIVAL_NODE: string,
  GRAB_INTERVAL?: string
) => {
  const interval = parseInt(GRAB_INTERVAL || "60") * 60 * 1000;

  await grabData(NODE_IP, ARCHIVAL_NODE);
  setInterval(() => grabData(NODE_IP, ARCHIVAL_NODE), interval);
};

export const grabData = async (NODE_IP: string, ARCHIVAL_NODE: string) => {
  try {
    // default app need sincronization
    let needSinc = true;
    let needSincData = await NearDB.getServiceData(NEED_SINK);
    if (needSincData) needSinc = JSON.parse(needSincData);

    const nearApi = new NearAPI(NODE_IP);
    const nearApiArchieve = new NearAPI(ARCHIVAL_NODE);

    let { epoch_length, runtime_config } = await nearApi.getProtocolConfig();

    const { epoch_start_height }: any = await nearApi.getCurrentValidators();

    const last_epoch_end_block = epoch_start_height - 1;

    if (needSinc) {
      //get previous epochs info
      let blockHeight = last_epoch_end_block;
      let iterations = 0;

      while (blockHeight > LAST_GOOD_BLOCK_HEIGHT) {
        try {
          // There are only last 4 epochs on main rpc nodes, previous epochs stored on archieval nodes
          if (iterations < 4)
            blockHeight = await getEpochInfoByBlock(
              nearApi,
              blockHeight,
              epoch_length
            );
          else {
            blockHeight = await getEpochInfoByBlock(
              nearApiArchieve,
              blockHeight,
              epoch_length
            );
          }
        } catch (error: any) {
          if (error) Logger.error(error.message || error);
          blockHeight = blockHeight - 1;
          continue;
        }
        iterations = iterations + 1;
        //blockHeight = blockHeight - epoch_length;
        console.log({ blockHeight, iterations: iterations });
      }
      await NearDB.addSeviceData(NEED_SINK, JSON.stringify(false));
    } else {
      //if current epoch has been added to DB -> skip it
      const data = await NearDB.getServiceData(LAST_EPOCH_END_BLOCK);
      Logger.info(`${LAST_EPOCH_END_BLOCK}: ${data}`);

      if (data && JSON.parse(data) === last_epoch_end_block) return;
      await NearDB.addSeviceData(
        LAST_EPOCH_END_BLOCK,
        String(last_epoch_end_block)
      );
      await getEpochInfoByBlock(nearApi, last_epoch_end_block, epoch_length);
    }
  } catch (error: any) {
    console.log(error);
    if (error) Logger.error(error);
  }
};
