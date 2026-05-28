// Types

import {
	ConsensusProtocol,
	ExecutionProtocol,
	NetworkExecutionUpgradeLayer,
} from '$/schema/NetworkUpgradeProtocols.ts'


// Constants

const executionProtocols = [
	{
		protocol: ExecutionProtocol.Ethereum,
		label: 'Ethereum execution',
	},
	{
		protocol: ExecutionProtocol.OpStack,
		label: 'OP Stack',
	},
	{
		protocol: ExecutionProtocol.PolygonBor,
		label: 'Polygon Bor',
	},
	{
		protocol: ExecutionProtocol.ArbitrumNitro,
		label: 'Arbitrum Nitro',
	},
	{
		protocol: ExecutionProtocol.Other,
		label: 'Other execution client',
	},
] as const satisfies readonly {
	protocol: ExecutionProtocol
	label: string
}[]

const consensusProtocols = [
	{
		protocol: ConsensusProtocol.EthereumBeacon,
		label: 'Ethereum beacon chain',
	},
] as const satisfies readonly {
	protocol: ConsensusProtocol
	label: string
}[]

const networkExecutionUpgradeLayers = [
	{
		layer: NetworkExecutionUpgradeLayer.Execution,
		label: 'Execution layer',
	},
	{
		layer: NetworkExecutionUpgradeLayer.Blob,
		label: 'Blob parameters',
	},
] as const satisfies readonly {
	layer: NetworkExecutionUpgradeLayer
	label: string
}[]


// Lookups

export const executionProtocolByProtocol = Object.fromEntries(
	executionProtocols.map((row) => [
		row.protocol,
		row,
	]),
)

export const consensusProtocolByProtocol = Object.fromEntries(
	consensusProtocols.map((row) => [
		row.protocol,
		row,
	]),
)

export const networkExecutionUpgradeLayerByLayer = Object.fromEntries(
	networkExecutionUpgradeLayers.map((row) => [
		row.layer,
		row,
	]),
)
