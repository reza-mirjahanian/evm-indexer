export const ETHERSCAN_BASE_API_URL =
  process.env.ETHERSCAN_BASE_API_URL ||
  'https://api.etherscan.io/v2/api?chainid=1';

export const ETHERSCAN_API_KEY =
  process.env.ETHERSCAN_API_KEY || 'SAWPNIM5KKPSQXRS28YA12B25SU1E3D3IF'; //todo: not safe!

export const ETHERSCAN_MAX_BLOCK_RANGE =
  Number(process.env.ETHERSCAN_MAX_BLOCK_RANGE) || 1000000;

export const GWEI_IN_WEI = BigInt(1_000_000_000);

// const WEI_PER_GWEI = 1e9;  // 1 Gwei = 1,000,000,000 Wei
// const WEI_PER_ETH = 1e18;  // 1 ETH = 1,000,000,000,000,000,000 Wei
