import { ScrollSepoliaTestnet } from "@thirdweb-dev/chains";

export const IS_DEV_ENV = process.env.NODE_ENV === "development";

const DEVELOPMENT_CHAIN = ScrollSepoliaTestnet; // e.g. Mumbai used for local development
const PRODUCTION_CHAIN = ScrollSepoliaTestnet; // You can use a different chain for production (e.g. Polygon)

export const CHAIN = IS_DEV_ENV ? DEVELOPMENT_CHAIN : PRODUCTION_CHAIN;
