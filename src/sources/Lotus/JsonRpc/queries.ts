import { networkBySlug } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/Lotus/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type {
	LotusActor,
	LotusMinerInfo,
	LotusMinerPower,
	LotusMinerSectorCount,
	LotusMessage,
	LotusSectorOnChainInfo,
	LotusTipset,
	LotusTipsetKey,
	LotusVersion,
} from '$/sources/Lotus/JsonRpc/types.ts'

const binding = bindings[Source.Lotus_JsonRpc].find(({ target }) => (
	target.key === `${networkBySlug.filecoin.caip2.namespace}:${networkBySlug.filecoin.caip2.reference}`
))

if (binding == null)
	throw new Error('Lotus_JsonRpc: no Filecoin binding')

export const rpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'GLIF',
}))

export const getTipSetByHeight = ({
	height,
}: {
	height: bigint
}) => (
	jsonRpc2<LotusTipset>(binding, 'Filecoin.ChainGetTipSetByHeight', [
		Number(height),
		null,
	])
)

export const getTipSet = ({
	tipsetKey,
}: {
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<LotusTipset>(binding, 'Filecoin.ChainGetTipSet', [
		tipsetKey,
	])
)

export const getHead = () => (
	jsonRpc2<LotusTipset>(binding, 'Filecoin.ChainHead', [])
)

export const getVersion = () => (
	jsonRpc2<LotusVersion>(binding, 'Filecoin.Version', [])
)

export const getNetworkVersion = ({
	tipsetKey,
}: {
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<number>(binding, 'Filecoin.StateNetworkVersion', [
		tipsetKey,
	])
)

export const getMinerPower = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<LotusMinerPower>(binding, 'Filecoin.StateMinerPower', [
		minerAddress,
		tipsetKey,
	])
)

export const getMinerInfo = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<LotusMinerInfo>(binding, 'Filecoin.StateMinerInfo', [
		minerAddress,
		tipsetKey,
	])
)

export const getMessage = ({
	messageCid,
}: {
	messageCid: string
}) => (
	jsonRpc2<LotusMessage>(binding, 'Filecoin.ChainGetMessage', [
		{ '/': messageCid },
	])
)

export const getActor = ({
	address,
	tipsetKey,
}: {
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<LotusActor>(binding, 'Filecoin.StateGetActor', [
		address,
		tipsetKey,
	])
)

export const getIdAddress = ({
	address,
	tipsetKey,
}: {
	address: string
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<string>(binding, 'Filecoin.StateLookupID', [
		address,
		tipsetKey,
	])
)

export const getMinerSectors = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<LotusSectorOnChainInfo[]>(binding, 'Filecoin.StateMinerSectors', [
		minerAddress,
		null,
		tipsetKey,
	])
)

export const getMinerActiveSectors = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<LotusSectorOnChainInfo[]>(binding, 'Filecoin.StateMinerActiveSectors', [
		minerAddress,
		tipsetKey,
	])
)

export const getMinerSectorCount = ({
	minerAddress,
	tipsetKey,
}: {
	minerAddress: string
	tipsetKey: LotusTipsetKey
}) => (
	jsonRpc2<LotusMinerSectorCount>(binding, 'Filecoin.StateMinerSectorCount', [
		minerAddress,
		tipsetKey,
	])
)
