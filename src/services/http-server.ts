import express from "express";
import NearDB from "../database/db";
const app = express();

app.get("/*", async (req, res) => {
  try {
    if (req.query.poolid) {
      const resp = await NearDB.getPoolInfo(req.query.poolid as string);

      if (!resp.length) {
        res.statusMessage = "Unknown poolid";
        res.statusCode = 400;
        res.send();
        return;
      } else {
        res.send({ name: req.query.poolid, history: resp });
        return;
      }
    }

    const epochs = await NearDB.getEpochs();
    const pools = await NearDB.getPools();
    const resp = {
      network: Config.NETWORK,
      epochs,
      pools,
    };
    res.send(resp);
  } catch (error) {
    res.send(error);
  }
});

export const httpServer = app;
