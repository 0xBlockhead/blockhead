import { type as arktype } from 'arktype'

import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	AvailHeader,
	AvailNetworkIdentity,
	AvailRuntimeVersion,
} from '$/sources/Avail/JsonRpc/types.ts'
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

const runtimeVersionWire = arktype({
	specName: 'string',
	implName: 'string',
	authoringVersion: 'number.integer >= 0',
	specVersion: 'number.integer >= 0',
	implVersion: 'number.integer >= 0',
	transactionVersion: 'number.integer >= 0',
	stateVersion: 'number.integer >= 0',
})

const assertBinding = (binding: SourceBinding) => {
	if (
		binding.source !== Source.Avail_JsonRpc
		|| binding.target.kind !== SourceTargetKind.NetworkSlug
		|| binding.target.key !== 'avail'
	)
		throw new Error('Avail_JsonRpc: expected canonical Avail mainnet binding')
}

const request = <_Result extends JsonValue>(
	binding: SourceBinding,
	method: string,
	params: readonly JsonValue[] = []
) => {
	assertBinding(binding)
	return jsonRpc2<_Result>(binding, method, params)
}

const assertHash = (
	hash: string,
	label: string
) => {
	if (!hashPattern.test(hash))
		throw new Error(`Avail_JsonRpc: invalid ${label}`)
}

const assertBlockNumber = (blockNumber: bigint) => {
	if (blockNumber < 0n || blockNumber > 4_294_967_295n)
		throw new Error('Avail_JsonRpc: block number must be an unsigned 32-bit integer')
}

const headerFromWire = ({
	wire,
	hash,
	finalized,
}: {
	wire: typeof headerWire.infer
	hash?: string
	finalized: boolean
}): AvailHeader => {
	for (const [value, label] of [
		[wire.parentHash, 'parent block hash'],
		[wire.stateRoot, 'state root'],
		[wire.extrinsicsRoot, 'extrinsics root'],
	] as const)
		assertHash(value, label)
	if (!quantityPattern.test(wire.number))
		throw new Error('Avail_JsonRpc: invalid block number')
	for (const digestLog of wire.digest.logs)
		if (!/^0x(?:[0-9a-fA-F]{2})*$/.test(digestLog))
			throw new Error('Avail_JsonRpc: invalid header digest log')
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
	binding: SourceBinding
): Promise<AvailNetworkIdentity> => {
	const [
		chainName,
		genesisHash,
	] = await Promise.all([
		request<string>(binding, 'system_chain'),
		request<string>(
			binding,
			'chain_getBlockHash',
			[0]
		),
	])
	if (chainName !== mainnetChainName)
		throw new Error('Avail_JsonRpc: foreign chain name')
	assertHash(genesisHash, 'genesis block hash')
	if (genesisHash.toLowerCase() !== mainnetGenesisHash)
		throw new Error('Avail_JsonRpc: foreign genesis block')
	return {
		chainName,
		genesisHash: genesisHash.toLowerCase(),
	}
}

export const getFinalizedHead = async (
	binding: SourceBinding
): Promise<AvailHeader> => {
	const hash = await request<string>(binding, 'chain_getFinalizedHead')
	assertHash(hash, 'finalized block hash')
	return headerFromWire({
		wire: headerWire.assert(await request<JsonValue>(
			binding,
			'chain_getHeader',
			[hash]
		)),
		hash,
		finalized: true,
	})
}

export const getBlockHash = async (
	binding: SourceBinding,
	blockNumber: bigint
) => {
	assertBlockNumber(blockNumber)
	const hash = await request<string>(
		binding,
		'chain_getBlockHash',
		[Number(blockNumber)]
	)
	assertHash(hash, 'block hash')
	return hash.toLowerCase()
}

export const getHeader = async (
	binding: SourceBinding,
	blockHash?: string
): Promise<AvailHeader> => {
	if (blockHash != null)
		assertHash(blockHash, 'block hash')
	return headerFromWire({
		wire: headerWire.assert(await request<JsonValue>(
			binding,
			'chain_getHeader',
			blockHash == null ? [] : [blockHash]
		)),
		hash: blockHash,
		finalized: false,
	})
}

export const getRuntimeVersion = async (
	binding: SourceBinding,
	blockHash?: string
): Promise<AvailRuntimeVersion> => {
	if (blockHash != null)
		assertHash(blockHash, 'runtime block hash')
	const wire = runtimeVersionWire.assert(await request<JsonValue>(
		binding,
		'state_getRuntimeVersion',
		blockHash == null ? [] : [blockHash]
	))
	for (const [value, label] of [
		[wire.authoringVersion, 'authoring version'],
		[wire.specVersion, 'spec version'],
		[wire.implVersion, 'implementation version'],
		[wire.transactionVersion, 'transaction version'],
		[wire.stateVersion, 'state version'],
	] as const)
		if (!Number.isSafeInteger(value))
			throw new Error(`Avail_JsonRpc: ${label} exceeds lossless JSON integer range`)
	return {
		specName: wire.specName,
		implName: wire.implName,
		authoringVersion: BigInt(wire.authoringVersion),
		specVersion: BigInt(wire.specVersion),
		implVersion: BigInt(wire.implVersion),
		transactionVersion: BigInt(wire.transactionVersion),
		stateVersion: BigInt(wire.stateVersion),
	}
}
