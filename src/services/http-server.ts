import express from "express";
import NearDB from "../database/db";
const app = express();

app.get("/poolid/:poolId", async (req, res) => {
  try {
    const resp = await NearDB.getPoolInfo(req.params.poolId);

    if (!resp.length) {
      res.statusMessage = "Bad request: Unknown poolid";
      res.statusCode = 400;
      res.send();
    } else {
      res.send({ name: req.params.poolId, history: resp });
    }
  } catch (error) {
    res.statusMessage = "Internal Server Error";
    res.statusCode = 500;
    res.send(error);
  }
});

app.get("/epoch/:epochId", async (req, res) => {
  try {
    const resp = await NearDB.getEpochValidatorsData(req.params.epochId);

    if (!resp.length) {
      res.statusMessage = "Bad request: Unknown epoch";
      res.statusCode = 400;
      res.send();
    } else {
      res.send({ epoch: req.params.epochId, validators: resp });
    }
  } catch (error) {
    res.statusMessage = "Internal Server Error";
    res.statusCode = 500;
    res.send(error);
  }
});

app.get("/*", async (req, res) => {
  try {
    const epochs = await NearDB.getEpochs();
    const pools = await NearDB.getPools();
    const resp = {
      network: Config.NETWORK,
      epochs,
      pools,
    };
    res.send(resp);
  } catch (error) {
    res.statusMessage = "Internal Server Error";
    res.statusCode = 500;
    res.send(error);
  }
});

export const httpServer = app;
