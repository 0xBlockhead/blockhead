// Types

import {
	ConsensusProtocol,
	ExecutionProtocol,
	NetworkExecutionUpgradeLayer,
} from '$/schema/NetworkUpgradeProtocols.ts'

export enum NetworkEnvironment {
	Mainnet = 'Mainnet',
	Testnet = 'Testnet',
}


// Constants

const networkEnvironmentRows = [
	{
		environment: NetworkEnvironment.Mainnet,
		label: 'Mainnet',
	},
	{
		environment: NetworkEnvironment.Testnet,
		label: 'Testnet',
	},
] as const satisfies readonly {
	environment: NetworkEnvironment
	label: string
}[]

const executionProtocolRows = [
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

const consensusProtocolRows = [
	{
		protocol: ConsensusProtocol.EthereumBeacon,
		label: 'Ethereum beacon chain',
	},
] as const satisfies readonly {
	protocol: ConsensusProtocol
	label: string
}[]

const networkExecutionUpgradeLayerRows = [
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

export const networkEnvironments = Object.fromEntries(
	networkEnvironmentRows.map((row) => [
		row.environment,
		row,
	]),
)

export const executionProtocols = Object.fromEntries(
	executionProtocolRows.map((row) => [
		row.protocol,
		row,
	]),
)

export const consensusProtocols = Object.fromEntries(
	consensusProtocolRows.map((row) => [
		row.protocol,
		row,
	]),
)

export const networkExecutionUpgradeLayers = Object.fromEntries(
	networkExecutionUpgradeLayerRows.map((row) => [
		row.layer,
		row,
	]),
)
