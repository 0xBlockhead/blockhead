import {
	resolveEnvLocator,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	availBlockWire,
	availHeaderWire,
	availSystemHealthWire,
	availSystemSyncStateWire,
} from '$/sources/Avail/JsonRpc/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


const mainnetChainName = 'Avail DA Mainnet'
const mainnetGenesisHash = '0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a'
const hashPattern = /^0x[0-9a-fA-F]{64}$/
const quantityPattern = /^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/

const request = <_Result extends JsonValue>(
	binding: SourceBinding,
	publicEnv: SourcePublicEnv,
	method: string,
	params: readonly JsonValue[] = []
) => jsonRpc2<_Result>(
	binding.endpoints.some((endpoint) => (
		resolveEnvLocator(endpoint.locator, publicEnv) !== endpoint.locator
	)) ?
		{
			...binding,
			endpoints: binding.endpoints.map((endpoint) => ({
				...endpoint,
				locator: resolveEnvLocator(endpoint.locator, publicEnv),
			})),
		}
	:
		binding,
	method,
	params
)

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Avail: invalid ${label} response envelope`)
	}
}

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
	wire: typeof availHeaderWire.infer
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
	binding: SourceBinding,
	publicEnv: SourcePublicEnv
) => {
	const [
		chainName,
		genesisHash,
	] = await Promise.all([
		request<string>(binding, publicEnv, 'system_chain'),
		getBlockHash(binding, publicEnv, 0n),
	])
	if (chainName !== mainnetChainName)
		throw new Error('Avail: foreign chain name')
	if (genesisHash !== mainnetGenesisHash)
		throw new Error('Avail: foreign genesis block')
	return {
		chainName,
		genesisHash,
	}
}

export const getSystemHealth = async (
	binding: SourceBinding,
	publicEnv: SourcePublicEnv
) => {
	const wire = assertEnvelope(
		'system_health',
		availSystemHealthWire,
		await request(binding, publicEnv, 'system_health')
	)
	return {
		peers: wire.peers,
		isSyncing: wire.isSyncing,
		shouldHavePeers: wire.shouldHavePeers,
	}
}

export const getSystemSyncState = async (
	binding: SourceBinding,
	publicEnv: SourcePublicEnv
) => {
	const wire = assertEnvelope(
		'system_syncState',
		availSystemSyncStateWire,
		await request(binding, publicEnv, 'system_syncState')
	)
	return {
		startingBlock: BigInt(wire.startingBlock),
		currentBlock: BigInt(wire.currentBlock),
		highestBlock: BigInt(wire.highestBlock),
	}
}

export const getFinalizedHead = async (
	binding: SourceBinding,
	publicEnv: SourcePublicEnv
) => {
	const hash = await request<string>(binding, publicEnv, 'chain_getFinalizedHead')
	assertHash(hash, 'finalized block hash')
	return headerFromWire({
		wire: assertEnvelope(
			'chain_getHeader',
			availHeaderWire,
			await request(binding, publicEnv, 'chain_getHeader', [hash])
		),
		hash,
		finalized: true,
	})
}

export const getBlockHash = async (
	binding: SourceBinding,
	publicEnv: SourcePublicEnv,
	blockNumber?: bigint
) => {
	if (blockNumber != null)
		assertBlockNumber(blockNumber)
	const hash = await request<string>(
		binding,
		publicEnv,
		'chain_getBlockHash',
		blockNumber == null ? [] : [Number(blockNumber)]
	)
	assertHash(hash, 'block hash')
	return hash.toLowerCase()
}

export const getHeader = async (
	binding: SourceBinding,
	publicEnv: SourcePublicEnv,
	blockHash?: string
) => {
	if (blockHash != null)
		assertHash(blockHash, 'block hash')
	return headerFromWire({
		wire: assertEnvelope(
			'chain_getHeader',
			availHeaderWire,
			await request(
				binding,
				publicEnv,
				'chain_getHeader',
				blockHash == null ? [] : [blockHash]
			)
		),
		hash: blockHash,
		finalized: false,
	})
}

export const getBlock = async (
	binding: SourceBinding,
	publicEnv: SourcePublicEnv,
	blockHash: string
) => {
	assertHash(blockHash, 'block hash')
	const wire = assertEnvelope(
		'chain_getBlock',
		availBlockWire,
		await request(binding, publicEnv, 'chain_getBlock', [blockHash])
	)
	const header = headerFromWire({
		wire: wire.block.header,
		hash: blockHash,
		finalized: false,
	})
	for (const extrinsic of wire.block.extrinsics)
		if (!/^0x(?:[0-9a-fA-F]{2})*$/.test(extrinsic))
			throw new Error('Avail: invalid extrinsic encoding')
	return {
		...header,
		extrinsicCount: wire.block.extrinsics.length,
		extrinsics: wire.block.extrinsics,
	}
}

export const getHeaderByBlockNumber = async (
	binding: SourceBinding,
	publicEnv: SourcePublicEnv,
	blockNumber: bigint
) => {
	const hash = await getBlockHash(binding, publicEnv, blockNumber)
	const header = await getHeader(binding, publicEnv, hash)
	if (header.blockNumber !== blockNumber)
		throw new Error(`Avail: header block number mismatch ${header.blockNumber} !== ${blockNumber}`)
	if (header.hash == null)
		throw new Error('Avail: header missing block hash')
	return {
		...header,
		hash: header.hash,
	}
}
