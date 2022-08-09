import { EpochValidatorInfo } from "near-api-js/lib/providers/provider";

export interface TNearConfig {
  epoch_length: number;
  runtime_config: { transaction_costs: ITransactionCosts };
}

export interface ITransactionCosts {
  action_creation_config: {};
  action_receipt_creation_config: {};
  burnt_gas_reward: [number, number];
  data_receipt_creation_config: {};
  pessimistic_gas_price_inflation_ratio: {};
}

export interface TValiatorInfo extends EpochValidatorInfo {
  epoch_height: number;
}
