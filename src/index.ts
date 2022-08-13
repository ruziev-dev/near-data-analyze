import { grabDataService } from "./services/grabData";
import { httpServer } from "./services/http-server";
import logger from "./services/logger";

require("dotenv").config({ path: ".env" });

const { NETWORK, NODE_IP, GRAB_INTERVAL, PORT, ARCHIVAL_NODE } = process.env;

globalThis.Config = {
  NETWORK,
  NODE_IP,
  GRAB_INTERVAL,
  PORT,
  ARCHIVAL_NODE,
};
// service to grab network data
grabDataService(
  NETWORK as string,
  NODE_IP as string,
  ARCHIVAL_NODE as string,
  GRAB_INTERVAL
);

// service to start http-server
httpServer.listen(PORT, () => {
  logger.info(`Server has been started on port: ${PORT}`);
});
