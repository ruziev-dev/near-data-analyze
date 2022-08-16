import fetch from "node-fetch";
import { TNearConfig, TValiatorInfo } from "./types";

export class NearAPI {
  private URL: string;
  constructor(url: string) {
    this.URL = url;
  }

  private async postFetch<T>(method: string, params: any = [null]): Promise<T> {
    const response = await fetch(this.URL, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method,
        params,
      }),
    });
    const { result } = await response.json();
    return result as T;
  }
  async getGasPrice(blockId: string | number) {
    return await this.postFetch("gas_price", { block_id: blockId });
  }

  async getBlock(blockId?: string | number) {
    const params = blockId ? { block_id: blockId } : { finality: "final" };
    return await this.postFetch("block", params);
  }
  async getLastBlock() {
    return await this.getBlock();
  }
  async getValidatorsByBlock(blockId: string | number): Promise<TValiatorInfo> {
    return await this.postFetch("validators", [blockId]);
  }
  async getCurrentValidators(): Promise<TValiatorInfo> {
    return await this.postFetch("validators", [null]);
  }
  async getValidatorsByEpoch(epochId: string): Promise<TValiatorInfo> {
    return await this.postFetch("validators", { epoch_id: epochId });
  }

  async getProtocolConfig(): Promise<TNearConfig> {
    const result = await this.postFetch("EXPERIMENTAL_protocol_config", {
      finality: "final",
    });
    return result as TNearConfig;
  }
}
