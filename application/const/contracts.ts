/**
 * Configure your smart contract addresses here.
 * Each smart contract should have two addresses defined:
 *   1. Development address - used for testing purposes
 *   2. Production address - the mainnet smart contract address for when you deploy your application
 */

import { IS_DEV_ENV } from "./chains";

// For example, below, we have a Greeter smart contract that has two addresses defined.
// Then, we use the IS_DEV_ENV variable to determine which address to use in the current environment.
const greeter_dev = "0xaD98E636f9bE52841F6009e66C91719f2c0057D1";
const greeter_prod = "0xaD98E636f9bE52841F6009e66C91719f2c0057D1";

// Below, we force the typescript type to be of the dev address type.
// This is to ensure thirdweb generate knows what the ABI is when using useContract
// So that we get type-safety when interacting with it's functions.
export const greeter = IS_DEV_ENV
  ? greeter_dev
  : (greeter_prod as typeof greeter_dev); // Here's the type assertion, since we assume the ABIs are the same in dev and prod.
