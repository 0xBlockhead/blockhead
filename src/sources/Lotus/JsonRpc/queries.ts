import { networkBySlug } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/Lotus/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	lotusActor,
	lotusBlockHeader,
	lotusIdAddress,
	lotusInvocationResult,
	lotusMarketDeal,
	lotusMessage,
	lotusMessageLookup,
	lotusMinerInfo,
	lotusMinerPower,
	lotusMinerSectorCount,
	lotusNetworkVersion,
	lotusSectorOnChainInfo,
	lotusTipset,
	lotusVersion,
	type LotusTipsetKey,
} from '$/sources/Lotus/JsonRpc/types.ts'

const binding = bindings[Source.Lotus_JsonRpc].find(({ target }) => (
	target.key === `${networkBySlug.filecoin.caip2.namespace}:${networkBySlug.filecoin.caip2.reference}`
))

if (binding == null)
	throw new Error('Lotus_JsonRpc: no Filecoin binding')

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Lotus_JsonRpc: invalid ${label} response envelope`)
	}
}

export const rpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'GLIF',
}))

export const getTipSetByHeight = async ({
	height,
}: {
	height: bigint
}) => {
	if (height < 0n || height > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error('Lotus_JsonRpc: invalid tipset height')

	const tipset = assertEnvelope(
		'tipset-by-height',
		lotusTipset,
		await jsonRpc2(binding, 'Filecoin.ChainGetTipSetByHeight', [
			Number(height),
			null,
		])
	)
	if (tipset.Height > Number(height))
		throw new Error('Lotus_JsonRpc: tipset response height exceeds request')
	return tipset
}

export const getTipSet = async ({
	tipsetKey,
}: {
	tipsetKey: LotusTipsetKey
}) => {
	const tipset = assertEnvelope(
		'tipset',
		lotusTipset,
		await jsonRpc2(binding, 'Filecoin.ChainGetTipSet', [
			tipsetKey,
		])
	)
	if (
		tipset.Cids.length !== tipsetKey.length
		|| tipset.Cids.some((cid, index) => cid['/'] !== tipsetKey[index]?.['/'])
	)
		throw new Error('Lotus_JsonRpc: tipset response key does not match request')
	return tipset
}

export const getHead = async () => (
	assertEnvelope(
		'chain-head',
		lotusTipset,
		await jsonRpc2(binding, 'Filecoin.ChainHead', [])
	)
)

export const getBlockHeader = async ({
	blockCid,
}: {
	blockCid: string
}) => (
	assertEnvelope(
		'block-header',
		lotusBlockHeader,
		await jsonRpc2(binding, 'Filecoin.ChainGetBlock', [{
			'/': blockCid,
		}])
	)
)

export const getVersion = async () => (
	assertEnvelope(
		'version',
		lotusVersion,
		await jsonRpc2(binding, 'Filecoin.Version', [])
	)
)

export const getNetworkVersion = async ({
	tipsetKey,
}: {
	tipsetKey: LotusTipsetKey
}) => (
	assertEnvelope(
		'network-version',
		lotusNetworkVersion,
		await jsonRpc2(binding, 'Filecoin.StateNetworkVersion', [
			tipsetKey,
		])
	)
)

export const getMinerPower = async ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	assertEnvelope(
		'miner-power',
		lotusMinerPower,
		await jsonRpc2(binding, 'Filecoin.StateMinerPower', [
			minerAddress,
			tipsetKey,
		])
	)
)

export const getMinerInfo = async ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	assertEnvelope(
		'miner-info',
		lotusMinerInfo,
		await jsonRpc2(binding, 'Filecoin.StateMinerInfo', [
			minerAddress,
			tipsetKey,
		])
	)
)

export const getMessage = async ({
	messageCid,
}: {
	messageCid: string
}) => (
	assertEnvelope(
		'message',
		lotusMessage,
		await jsonRpc2(binding, 'Filecoin.ChainGetMessage', [
			{ '/': messageCid },
		])
	)
)

export const searchMessage = async ({
	messageCid,
}: {
	messageCid: string
}) => {
	const lookup = await jsonRpc2(binding, 'Filecoin.StateSearchMsg', [
		{
			'/': messageCid,
		},
	])
	if (lookup == null)
		throw new Error(`Lotus_JsonRpc: message ${messageCid} was not found on chain`)

	const asserted = assertEnvelope('message lookup', lotusMessageLookup, lookup)
	if (asserted.Message['/'] !== messageCid)
		throw new Error('Lotus_JsonRpc: message lookup identity does not match request')

	return asserted
}

export const replayMessage = async ({
	messageCid,
	tipsetKey,
}: {
	messageCid: string
	tipsetKey: LotusTipsetKey
}) => {
	const replay = assertEnvelope(
		'message replay',
		lotusInvocationResult,
		await jsonRpc2(binding, 'Filecoin.StateReplay', [
			tipsetKey,
			{
				'/': messageCid,
			},
		])
	)
	if (replay.MsgCid['/'] !== messageCid)
		throw new Error('Lotus_JsonRpc: message replay identity does not match request')

	return replay
}

export const getActor = async ({
	address,
	tipsetKey,
}: {
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	assertEnvelope(
		'actor',
		lotusActor,
		await jsonRpc2(binding, 'Filecoin.StateGetActor', [
			address,
			tipsetKey,
		])
	)
)

export const getIdAddress = async ({
	address,
	tipsetKey,
}: {
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	assertEnvelope(
		'id-address',
		lotusIdAddress,
		await jsonRpc2(binding, 'Filecoin.StateLookupID', [
			address,
			tipsetKey,
		])
	)
)

export const getMinerSectors = async ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => {
	const sectors = assertEnvelope(
		'miner-sectors',
		lotusSectorOnChainInfo.array(),
		await jsonRpc2(binding, 'Filecoin.StateMinerSectors', [
			minerAddress,
			null,
			tipsetKey,
		])
	)
	if (new Set(sectors.map((sector) => sector.SectorNumber)).size !== sectors.length)
		throw new Error('Lotus_JsonRpc: miner sectors contains duplicate sector number')

	return sectors
}

export const getMinerActiveSectors = async ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => {
	const activeSectors = assertEnvelope(
		'miner-active-sectors',
		lotusSectorOnChainInfo.array(),
		await jsonRpc2(binding, 'Filecoin.StateMinerActiveSectors', [
			minerAddress,
			tipsetKey,
		])
	)
	if (new Set(activeSectors.map((sector) => sector.SectorNumber)).size !== activeSectors.length)
		throw new Error('Lotus_JsonRpc: miner active sectors contains duplicate sector number')

	return activeSectors
}

export const getMinerSectorCount = async ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	assertEnvelope(
		'miner-sector-count',
		lotusMinerSectorCount,
		await jsonRpc2(binding, 'Filecoin.StateMinerSectorCount', [
			minerAddress,
			tipsetKey,
		])
	)
)

export const getMarketStorageDeal = async ({
	dealId,
	tipsetKey = null,
}: {
	dealId: bigint
	tipsetKey?: LotusTipsetKey | null
}) => {
	if (dealId < 0n)
		throw new Error('Lotus_JsonRpc: invalid deal id')

	return assertEnvelope(
		'market-storage-deal',
		lotusMarketDeal,
		await jsonRpc2(binding, 'Filecoin.StateMarketStorageDeal', [
			Number(dealId),
			tipsetKey,
		])
	)
}
