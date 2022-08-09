import { Near } from "near-api-js";
import {
  BlockId,
  CurrentEpochValidatorInfo,
  EpochValidatorInfo,
} from "near-api-js/lib/providers/provider";
import { TNearConfig, TValiatorInfo } from "./types";

export class NearAPI {
  private NEAR: Near;
  constructor(Near: Near) {
    this.NEAR = Near;
  }

  async getGasPrice(blockId: BlockId) {
    return await this.NEAR.connection.provider.gasPrice(blockId);
  }

  async getBlock(blockId: BlockId) {
    return await this.NEAR.connection.provider.block({ blockId });
  }
  async getLastBlock() {
    return await this.NEAR.connection.provider.block({ finality: "final" });
  }
  async getValidators(blockId: BlockId): Promise<TValiatorInfo> {
    //@ts-ignore
    return await this.NEAR.connection.provider.validators(blockId);
  }
  async getCurrentValidators(): Promise<TValiatorInfo> {
    //@ts-ignore
    return await this.NEAR.connection.provider.validators(null);
  }

  async getProtocolConfig(blockId?: BlockId | null): Promise<TNearConfig> {
    const result =
      await this.NEAR.connection.provider.experimental_protocolConfig(
        //@ts-ignore
        blockId ? { block_id: blockId } : { finality: "final" }
      );
    return result as unknown as TNearConfig;
  }
}
