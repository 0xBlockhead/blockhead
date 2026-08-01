import { type as arktype } from 'arktype'

import {
	resolveEnvLocator,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/Avail/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const mainnetChainName = 'Avail DA Mainnet'
const mainnetGenesisHash = '0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a'
const hashPattern = /^0x[0-9a-fA-F]{64}$/
const quantityPattern = /^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/

const headerWire = arktype({
	parentHash: 'string',
	number: 'string',
	stateRoot: 'string',
	extrinsicsRoot: 'string',
	digest: {
		logs: 'string[]',
	},
})

const binding = bindings[Source.Avail]

const request = <_Result extends JsonValue>(
	publicEnv: SourcePublicEnv,
	method: string,
	params: readonly JsonValue[] = []
) => jsonRpc2<_Result>({
	...binding,
	endpoints: binding.endpoints.map((endpoint) => ({
		...endpoint,
		locator: resolveEnvLocator(endpoint.locator, publicEnv),
	})),
}, method, params)

const assertHash = (
	hash: string,
	label: string
) => {
	if (!hashPattern.test(hash))
		throw new Error(`Avail: invalid ${label}`)
}

const assertBlockNumber = (blockNumber: bigint) => {
	if (blockNumber < 0n || blockNumber > 4_294_967_295n)
		throw new Error('Avail: block number must be an unsigned 32-bit integer')
}

const headerFromWire = ({
	wire,
	hash,
	finalized,
}: {
	wire: typeof headerWire.infer
	hash?: string
	finalized: boolean
}) => {
	for (const [value, label] of [
		[wire.parentHash, 'parent block hash'],
		[wire.stateRoot, 'state root'],
		[wire.extrinsicsRoot, 'extrinsics root'],
	])
		assertHash(value, label)
	if (!quantityPattern.test(wire.number))
		throw new Error('Avail: invalid block number')
	for (const digestLog of wire.digest.logs)
		if (!/^0x(?:[0-9a-fA-F]{2})*$/.test(digestLog))
			throw new Error('Avail: invalid header digest log')
	return {
		...(hash != null && {
			hash: hash.toLowerCase(),
		}),
		parentHash: wire.parentHash.toLowerCase(),
		blockNumber: BigInt(wire.number),
		stateRoot: wire.stateRoot.toLowerCase(),
		extrinsicsRoot: wire.extrinsicsRoot.toLowerCase(),
		digestLogs: wire.digest.logs,
		finalized,
	}
}

export const getNetworkIdentity = async (
	publicEnv: SourcePublicEnv
) => {
	const [
		chainName,
		genesisHash,
	] = await Promise.all([
		request<string>(publicEnv, 'system_chain'),
		request<string>(
			publicEnv,
			'chain_getBlockHash',
			[0]
		),
	])
	if (chainName !== mainnetChainName)
		throw new Error('Avail: foreign chain name')
	assertHash(genesisHash, 'genesis block hash')
	if (genesisHash.toLowerCase() !== mainnetGenesisHash)
		throw new Error('Avail: foreign genesis block')
	return {
		chainName,
		genesisHash: genesisHash.toLowerCase(),
	}
}

export const getFinalizedHead = async (
	publicEnv: SourcePublicEnv
) => {
	const hash = await request<string>(publicEnv, 'chain_getFinalizedHead')
	assertHash(hash, 'finalized block hash')
	return headerFromWire({
		wire: headerWire.assert(await request<JsonValue>(
			publicEnv,
			'chain_getHeader',
			[hash]
		)),
		hash,
		finalized: true,
	})
}

export const getBlockHash = async (
	publicEnv: SourcePublicEnv,
	blockNumber?: bigint
) => {
	if (blockNumber != null)
		assertBlockNumber(blockNumber)
	const hash = await request<string>(
		publicEnv,
		'chain_getBlockHash',
		blockNumber == null ? [] : [Number(blockNumber)]
	)
	assertHash(hash, 'block hash')
	return hash.toLowerCase()
}

export const getHeader = async (
	publicEnv: SourcePublicEnv,
	blockHash?: string
) => {
	if (blockHash != null)
		assertHash(blockHash, 'block hash')
	return headerFromWire({
		wire: headerWire.assert(await request<JsonValue>(
			publicEnv,
			'chain_getHeader',
			blockHash == null ? [] : [blockHash]
		)),
		hash: blockHash,
		finalized: false,
	})
}
