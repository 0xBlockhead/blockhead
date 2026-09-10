import { query } from '$app/server'
import { env } from '$env/dynamic/public'
import { type } from 'arktype'
import * as native from '$/sources/Avail/JsonRpc/queries.ts'

const configuredEnvWire = type({ PUBLIC_AVAIL_RPC_URL: 'string.url' })
const configuredEnv = () => configuredEnvWire.assert({
	PUBLIC_AVAIL_RPC_URL: env.PUBLIC_AVAIL_RPC_URL,
})

const blockNumber = type('bigint').narrow((value) => value >= 0n && value <= 4_294_967_295n)
const blockHash = type(/^0x[0-9a-fA-F]{64}$/)

export const getNetworkIdentity = query(() => native.getNetworkIdentity(configuredEnv()))
export const getSystemHealth = query(() => native.getSystemHealth(configuredEnv()))
export const getSystemSyncState = query(() => native.getSystemSyncState(configuredEnv()))
export const getFinalizedHead = query(() => native.getFinalizedHead(configuredEnv()))

export const getBlockHash = query(blockNumber.or('undefined'), (value) => native.getBlockHash(configuredEnv(), value))
export const getHeader = query(blockHash.or('undefined'), (value) => native.getHeader(configuredEnv(), value))
export const getBlock = query(blockHash, (value) => native.getBlock(configuredEnv(), value))
export const getBlockTimestamp = query(blockHash, (value) => native.getBlockTimestamp(configuredEnv(), value))
export const getHeaderByBlockNumber = query(blockNumber, (value) => native.getHeaderByBlockNumber(configuredEnv(), value))
export const getDataProof = query(
	type({
		blockHash,
		extrinsicIndex: '0 <= number.integer <= 4294967295',
		'+': 'reject',
	}),
	({ blockHash, extrinsicIndex }) => native.getDataProof(configuredEnv(), blockHash, extrinsicIndex)
)
