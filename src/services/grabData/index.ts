import { Near, connect } from "near-api-js";
import NearDB from "../../database/db";
import { NearAPI } from "../../NearAPI/api";
import Logger from "../logger";
import { getEpochInfoByBlock } from "./utils";

const NEED_SINK = "NEED_SINK";

export const grabDataService = async (
  NETWORK: string,
  NODE_IP: string,
  ARCHIVAL_NODE: string,
  GRAB_INTERVAL?: string
) => {
  const interval = parseInt(GRAB_INTERVAL || "60") * 60 * 1000;
  const officialNearApi = await connect({
    networkId: NETWORK,
    nodeUrl: NODE_IP,
    headers: {},
  });
  const archievalNearApi = await connect({
    networkId: NETWORK,
    nodeUrl: ARCHIVAL_NODE,
    headers: {},
  });
  await grabData(officialNearApi, archievalNearApi);
  setInterval(() => grabData(officialNearApi, archievalNearApi), interval);
};

export const grabData = async (
  currentNearApi: Near,
  archievalNearApi: Near
) => {
  try {
    // default app need sincronization
    let needSinc = true;
    let needSincData = await NearDB.getServiceData(NEED_SINK);
    if (needSincData) needSinc = JSON.parse(needSincData);

    const nearApi = new NearAPI(currentNearApi);
    const nearApiArchieve = new NearAPI(archievalNearApi);

    let { epoch_length, runtime_config } = await nearApi.getProtocolConfig();

    const { epoch_start_height } = await nearApi.getCurrentValidators();

    if (needSinc) {
      //get current epoch info
      await getEpochInfoByBlock(nearApi, null, epoch_length);

      //get previous epochs info
      let blockHeight = epoch_start_height - 1;
      let iterations = 0;
      console.log({ epoch_length });
      while (blockHeight >= 0) {
        try {
          // There are only last 4 epochs on main rpc nodes, previous epochs stored on archieval nodes
          if (iterations < 4)
            await getEpochInfoByBlock(nearApi, blockHeight, epoch_length);
          else {
            await getEpochInfoByBlock(
              nearApiArchieve,
              blockHeight,
              epoch_length
            );
          }
        } catch (error: any) {
          if (error) Logger.error(error);

          await NearDB.addSeviceData(NEED_SINK, JSON.stringify(false));
          break;
          /*
           * There are some troubles on epoch 1289 (Unknown Epoch)
           * TODO: understand how to fix it
           */
        }
        iterations = iterations + 1;
        blockHeight = blockHeight - epoch_length;
        console.log({ blockHeight, iterations });
      }
      await NearDB.addSeviceData(NEED_SINK, JSON.stringify(false));
    } else {
      await getEpochInfoByBlock(nearApi, null, epoch_length);
    }
  } catch (error: any) {
    if (error) Logger.error(error);
  }
};
