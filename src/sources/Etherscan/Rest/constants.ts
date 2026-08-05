/**
 * Chains this client treats as Etherscan V2–capable (numeric **`chainid`** must match supported chains).
 * Snapshot of **`GET https://api.etherscan.io/v2/chainlist`** rows with **`status: 1`** (2026-08-04).
 */

// Constants

/** Etherscan account list endpoints cap at 10_000 rows per request. */
export const accountListMaxOffset = 10_000

/**
 * `module=account` list endpoints treat these status-0 messages as successful empty lists.
 * @see https://docs.etherscan.io/api-reference/endpoint/txlist
 */
export const accountEmptyMessages = [
	'No transactions found',
	'No records found',
] as const

/**
 * `module=contract` **`getabi`** / **`getsourcecode`** — verified-absent (not a transport failure).
 * @see https://docs.etherscan.io/api-reference/endpoint/getabi
 */
export const contractUnverifiedMessages = [
	'Contract source code not verified',
] as const

/**
 * `module=contract` **`getcontractcreation`** — no creation row for the address.
 * @see https://docs.etherscan.io/api-reference/endpoint/getcontractcreation
 */
export const contractCreationAbsentMessages = [
	'Contract source code not verified',
	'No transaction found for this contract address',
	'No contracts found',
] as const

export const supportedChainIds = [
	1,
	10,
	50,
	51,
	56,
	97,
	100,
	130,
	137,
	143,
	146,
	199,
	204,
	252,
	480,
	988,
	999,
	1029,
	1284,
	1285,
	1287,
	1301,
	1328,
	1329,
	2201,
	2523,
	2741,
	4326,
	4352,
	4801,
	5000,
	5003,
	5611,
	6343,
	8453,
	9745,
	9746,
	10143,
	11124,
	14601,
	33111,
	33139,
	42161,
	42220,
	43113,
	43114,
	43522,
	59141,
	59144,
	80002,
	80069,
	80094,
	81457,
	84532,
	167000,
	167013,
	421614,
	560048,
	737373,
	747474,
	11142220,
	11155111,
	11155420,
	168587773,
] as const
