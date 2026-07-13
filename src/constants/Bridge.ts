// Types

import { BridgeRouteTag } from '$/schema/BridgeRoute.ts'


export enum BridgeRailId {
	Across = 'Across',
	Allbridge = 'Allbridge',
	ArbitrumCanonical = 'ArbitrumCanonical',
	Celer = 'Celer',
	Cctp = 'Cctp',
	Chainflip = 'Chainflip',
	Eco = 'Eco',
	Garden = 'Garden',
	GasZip = 'GasZip',
	Glacis = 'Glacis',
	GnosisCanonical = 'GnosisCanonical',
	Hyperliquid = 'Hyperliquid',
	LifiIntents = 'LifiIntents',
	Mayan = 'Mayan',
	MegaEth = 'MegaEth',
	NearIntents = 'NearIntents',
	Omni = 'Omni',
	Paxos = 'Paxos',
	PolygonPos = 'PolygonPos',
	Polymer = 'Polymer',
	Relay = 'Relay',
	Squid = 'Squid',
	Stargate = 'Stargate',
	Superset = 'Superset',
	Symbiosis = 'Symbiosis',
	Unit = 'Unit',
	Wormhole = 'Wormhole',
}

export enum BridgeSettlementModel {
	AtomicSwap = 'AtomicSwap',
	BurnMint = 'BurnMint',
	CanonicalDeposit = 'CanonicalDeposit',
	ChainAbstraction = 'ChainAbstraction',
	IntentFill = 'IntentFill',
	LiquidityNetwork = 'LiquidityNetwork',
	LockMint = 'LockMint',
	LockUnlock = 'LockUnlock',
}

export enum BridgeVerificationModel {
	External = 'External',
	Issuer = 'Issuer',
	Local = 'Local',
	Native = 'Native',
	Optimistic = 'Optimistic',
}

export enum BridgeAssetOutcome {
	LiquidityPoolNative = 'LiquidityPoolNative',
	MappedSwap = 'MappedSwap',
	MessageOnly = 'MessageOnly',
	SameNative = 'SameNative',
	WrappedMint = 'WrappedMint',
}

export enum CoinInstanceRepresentation {
	BridgeWrapped = 'BridgeWrapped',
	CanonicalL2Native = 'CanonicalL2Native',
	IssuerNative = 'IssuerNative',
	LiquidityNetworkReceipt = 'LiquidityNetworkReceipt',
	OmnichainFungible = 'OmnichainFungible',
	Unknown = 'Unknown',
}

export type BridgeToolDefinition = {
	label: string
	railId: BridgeRailId
	settlementModel: BridgeSettlementModel
	verificationModel: BridgeVerificationModel
	componentToolKeys?: string[]
}

export type BridgeToolRow = BridgeToolDefinition & {
	key: string
	assetOutcome: BridgeAssetOutcome
}


// Constants

export const bridgeTools = [
	{
		key: 'cbridge',
		label: 'Celer cBridge',
		railId: BridgeRailId.Celer,
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.LiquidityPoolNative,
	},
	{
		key: 'arbitrum',
		label: 'Arbitrum Bridge',
		railId: BridgeRailId.ArbitrumCanonical,
		settlementModel: BridgeSettlementModel.CanonicalDeposit,
		verificationModel: BridgeVerificationModel.Native,
		assetOutcome: BridgeAssetOutcome.MappedSwap,
	},
	{
		key: 'across',
		label: 'AcrossV4',
		railId: BridgeRailId.Across,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.Optimistic,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'gnosis',
		label: 'Gnosis Bridge',
		railId: BridgeRailId.GnosisCanonical,
		settlementModel: BridgeSettlementModel.CanonicalDeposit,
		verificationModel: BridgeVerificationModel.Native,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'omni',
		label: 'Omni Bridge',
		railId: BridgeRailId.Omni,
		settlementModel: BridgeSettlementModel.LockMint,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.WrappedMint,
	},
	{
		key: 'celercircle',
		label: 'CCTP + Celer (Standard)',
		railId: BridgeRailId.Cctp,
		settlementModel: BridgeSettlementModel.BurnMint,
		verificationModel: BridgeVerificationModel.Issuer,
		assetOutcome: BridgeAssetOutcome.SameNative,
		componentToolKeys: [
			'cbridge',
		],
	},
	{
		key: 'celercirclefast',
		label: 'CCTP + Celer (Fast)',
		railId: BridgeRailId.Cctp,
		settlementModel: BridgeSettlementModel.BurnMint,
		verificationModel: BridgeVerificationModel.Issuer,
		assetOutcome: BridgeAssetOutcome.SameNative,
		componentToolKeys: [
			'cbridge',
		],
	},
	{
		key: 'allbridge',
		label: 'Allbridge',
		railId: BridgeRailId.Allbridge,
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'squid',
		label: 'Squid',
		railId: BridgeRailId.Squid,
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'mayan',
		label: 'Mayan (Swift)',
		railId: BridgeRailId.Mayan,
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.LiquidityPoolNative,
	},
	{
		key: 'mayanWH',
		label: 'Mayan (Wormhole)',
		railId: BridgeRailId.Wormhole,
		settlementModel: BridgeSettlementModel.LockMint,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.WrappedMint,
		componentToolKeys: [
			'mayan',
		],
	},
	{
		key: 'mayanMCTP',
		label: 'CCTP + Mayan',
		railId: BridgeRailId.Cctp,
		settlementModel: BridgeSettlementModel.BurnMint,
		verificationModel: BridgeVerificationModel.Issuer,
		assetOutcome: BridgeAssetOutcome.SameNative,
		componentToolKeys: [
			'mayan',
		],
	},
	{
		key: 'stargateV2',
		label: 'StargateV2 (Fast mode)',
		railId: BridgeRailId.Stargate,
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'stargateV2Bus',
		label: 'StargateV2 (Economy mode)',
		railId: BridgeRailId.Stargate,
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'symbiosis',
		label: 'Symbiosis',
		railId: BridgeRailId.Symbiosis,
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.WrappedMint,
	},
	{
		key: 'polygon',
		label: 'Polygon Bridge (PoS)',
		railId: BridgeRailId.PolygonPos,
		settlementModel: BridgeSettlementModel.CanonicalDeposit,
		verificationModel: BridgeVerificationModel.Native,
		assetOutcome: BridgeAssetOutcome.MappedSwap,
	},
	{
		key: 'glacis',
		label: 'Glacis',
		railId: BridgeRailId.Glacis,
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'chainflip',
		label: 'Chainflip',
		railId: BridgeRailId.Chainflip,
		settlementModel: BridgeSettlementModel.AtomicSwap,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.MappedSwap,
	},
	{
		key: 'gasZipBridge',
		label: 'GasZip',
		railId: BridgeRailId.GasZip,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'relaydepository',
		label: 'Relay',
		railId: BridgeRailId.Relay,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.Optimistic,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'mayanFastMCTP',
		label: 'CCTPv2 + Mayan',
		railId: BridgeRailId.Cctp,
		settlementModel: BridgeSettlementModel.BurnMint,
		verificationModel: BridgeVerificationModel.Issuer,
		assetOutcome: BridgeAssetOutcome.SameNative,
		componentToolKeys: [
			'mayan',
		],
	},
	{
		key: 'unit',
		label: 'Unit',
		railId: BridgeRailId.Unit,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'polymer',
		label: 'Polymer (Fast)',
		railId: BridgeRailId.Polymer,
		settlementModel: BridgeSettlementModel.BurnMint,
		verificationModel: BridgeVerificationModel.Local,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'polymerStandard',
		label: 'Polymer (Standard)',
		railId: BridgeRailId.Polymer,
		settlementModel: BridgeSettlementModel.BurnMint,
		verificationModel: BridgeVerificationModel.Local,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'eco',
		label: 'Eco',
		railId: BridgeRailId.Eco,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'near',
		label: 'NearIntents',
		railId: BridgeRailId.NearIntents,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'hyperliquidSA',
		label: 'Hyperliquid',
		railId: BridgeRailId.Hyperliquid,
		settlementModel: BridgeSettlementModel.ChainAbstraction,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'lifiIntents',
		label: 'LI.FI Intents',
		railId: BridgeRailId.LifiIntents,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'garden',
		label: 'Garden',
		railId: BridgeRailId.Garden,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.MappedSwap,
	},
	{
		key: 'megaeth',
		label: 'MegaETH Gateway',
		railId: BridgeRailId.MegaEth,
		settlementModel: BridgeSettlementModel.CanonicalDeposit,
		verificationModel: BridgeVerificationModel.Native,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'hyperliquidNative',
		label: 'Hyperliquid Native',
		railId: BridgeRailId.Hyperliquid,
		settlementModel: BridgeSettlementModel.LockMint,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'superset',
		label: 'Superset',
		railId: BridgeRailId.Superset,
		settlementModel: BridgeSettlementModel.IntentFill,
		verificationModel: BridgeVerificationModel.External,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
	{
		key: 'paxos',
		label: 'Paxos Transit',
		railId: BridgeRailId.Paxos,
		settlementModel: BridgeSettlementModel.BurnMint,
		verificationModel: BridgeVerificationModel.Issuer,
		assetOutcome: BridgeAssetOutcome.SameNative,
	},
] as const satisfies readonly BridgeToolRow[]

const bridgeSettlementModels = [
	{
		settlementModel: BridgeSettlementModel.AtomicSwap,
		label: 'Atomic swap',
	},
	{
		settlementModel: BridgeSettlementModel.BurnMint,
		label: 'Burn and mint',
	},
	{
		settlementModel: BridgeSettlementModel.CanonicalDeposit,
		label: 'Canonical deposit',
	},
	{
		settlementModel: BridgeSettlementModel.ChainAbstraction,
		label: 'Chain abstraction',
	},
	{
		settlementModel: BridgeSettlementModel.IntentFill,
		label: 'Intent fill',
	},
	{
		settlementModel: BridgeSettlementModel.LiquidityNetwork,
		label: 'Liquidity network',
	},
	{
		settlementModel: BridgeSettlementModel.LockMint,
		label: 'Lock and mint',
	},
	{
		settlementModel: BridgeSettlementModel.LockUnlock,
		label: 'Lock and unlock',
	},
] as const satisfies readonly {
	settlementModel: BridgeSettlementModel
	label: string
}[]

const bridgeVerificationModels = [
	{
		verificationModel: BridgeVerificationModel.External,
		label: 'External verifier',
	},
	{
		verificationModel: BridgeVerificationModel.Issuer,
		label: 'Issuer attestation',
	},
	{
		verificationModel: BridgeVerificationModel.Local,
		label: 'Local verification',
	},
	{
		verificationModel: BridgeVerificationModel.Native,
		label: 'Native (L1) verification',
	},
	{
		verificationModel: BridgeVerificationModel.Optimistic,
		label: 'Optimistic verification',
	},
] as const satisfies readonly {
	verificationModel: BridgeVerificationModel
	label: string
}[]

const bridgeAssetOutcomes = [
	{
		assetOutcome: BridgeAssetOutcome.LiquidityPoolNative,
		label: 'Liquidity pool native asset',
	},
	{
		assetOutcome: BridgeAssetOutcome.MappedSwap,
		label: 'Mapped swap',
	},
	{
		assetOutcome: BridgeAssetOutcome.MessageOnly,
		label: 'Message only',
	},
	{
		assetOutcome: BridgeAssetOutcome.SameNative,
		label: 'Same native asset',
	},
	{
		assetOutcome: BridgeAssetOutcome.WrappedMint,
		label: 'Wrapped mint',
	},
] as const satisfies readonly {
	assetOutcome: BridgeAssetOutcome
	label: string
}[]

const coinInstanceRepresentations = [
	{
		representation: CoinInstanceRepresentation.BridgeWrapped,
		label: 'Bridge-wrapped token',
	},
	{
		representation: CoinInstanceRepresentation.CanonicalL2Native,
		label: 'Canonical L2 native',
	},
	{
		representation: CoinInstanceRepresentation.IssuerNative,
		label: 'Issuer-native token',
	},
	{
		representation: CoinInstanceRepresentation.LiquidityNetworkReceipt,
		label: 'Liquidity network receipt',
	},
	{
		representation: CoinInstanceRepresentation.OmnichainFungible,
		label: 'Omnichain fungible token',
	},
	{
		representation: CoinInstanceRepresentation.Unknown,
		label: 'Unknown representation',
	},
] as const satisfies readonly {
	representation: CoinInstanceRepresentation
	label: string
}[]

const bridgeRouteStepTypes = [
	{
		stepType: 'swap',
		label: 'Swap',
	},
	{
		stepType: 'cross',
		label: 'Cross-chain',
	},
	{
		stepType: 'lifi',
		label: 'LI.FI aggregate',
	},
	{
		stepType: 'protocol',
		label: 'Protocol',
	},
] as const satisfies readonly {
	stepType: string
	label: string
}[]

const bridgeRouteTags = [
	{
		tag: BridgeRouteTag.Best,
		label: 'Best overall',
	},
	{
		tag: BridgeRouteTag.Cheapest,
		label: 'Cheapest',
	},
	{
		tag: BridgeRouteTag.Fastest,
		label: 'Fastest',
	},
	{
		tag: BridgeRouteTag.Recommended,
		label: 'Recommended',
	},
] as const satisfies readonly {
	tag: BridgeRouteTag
	label: string
}[]


// Lookups

export const bridgeToolByKey = Object.fromEntries(
	bridgeTools.map((bridgeTool) => [
		bridgeTool.key,
		bridgeTool,
	])
)

export const bridgeRails = [
	{
		railId: BridgeRailId.Across,
		label: 'Across',
	},
	{
		railId: BridgeRailId.Allbridge,
		label: 'Allbridge',
	},
	{
		railId: BridgeRailId.ArbitrumCanonical,
		label: 'Arbitrum canonical bridge',
	},
	{
		railId: BridgeRailId.Celer,
		label: 'Celer cBridge',
	},
	{
		railId: BridgeRailId.Cctp,
		label: 'Circle CCTP',
	},
	{
		railId: BridgeRailId.Chainflip,
		label: 'Chainflip',
	},
	{
		railId: BridgeRailId.Eco,
		label: 'Eco',
	},
	{
		railId: BridgeRailId.Garden,
		label: 'Garden',
	},
	{
		railId: BridgeRailId.GasZip,
		label: 'Gas.zip',
	},
	{
		railId: BridgeRailId.Glacis,
		label: 'Glacis',
	},
	{
		railId: BridgeRailId.GnosisCanonical,
		label: 'Gnosis canonical bridge',
	},
	{
		railId: BridgeRailId.Hyperliquid,
		label: 'Hyperliquid',
	},
	{
		railId: BridgeRailId.LifiIntents,
		label: 'LI.FI Intents',
	},
	{
		railId: BridgeRailId.Mayan,
		label: 'Mayan',
	},
	{
		railId: BridgeRailId.MegaEth,
		label: 'MegaETH Gateway',
	},
	{
		railId: BridgeRailId.NearIntents,
		label: 'NEAR Intents',
	},
	{
		railId: BridgeRailId.Omni,
		label: 'Omni Bridge',
	},
	{
		railId: BridgeRailId.PolygonPos,
		label: 'Polygon PoS bridge',
	},
	{
		railId: BridgeRailId.Polymer,
		label: 'Polymer',
	},
	{
		railId: BridgeRailId.Relay,
		label: 'Relay',
	},
	{
		railId: BridgeRailId.Squid,
		label: 'Squid',
	},
	{
		railId: BridgeRailId.Stargate,
		label: 'Stargate',
	},
	{
		railId: BridgeRailId.Symbiosis,
		label: 'Symbiosis',
	},
	{
		railId: BridgeRailId.Unit,
		label: 'Unit',
	},
	{
		railId: BridgeRailId.Wormhole,
		label: 'Wormhole',
	},
] as const satisfies readonly {
	railId: BridgeRailId
	label: string
}[]

export const bridgeRailById = Object.fromEntries(
	bridgeRails.map((bridgeRail) => [
		bridgeRail.railId,
		bridgeRail,
	])
)

export const bridgeSettlementModelBySettlementModel = Object.fromEntries(
	bridgeSettlementModels.map((row) => [
		row.settlementModel,
		row,
	])
)

export const bridgeVerificationModelByVerificationModel = Object.fromEntries(
	bridgeVerificationModels.map((row) => [
		row.verificationModel,
		row,
	])
)

export const bridgeAssetOutcomeByAssetOutcome = Object.fromEntries(
	bridgeAssetOutcomes.map((row) => [
		row.assetOutcome,
		row,
	])
)

export const coinInstanceRepresentationByRepresentation = Object.fromEntries(
	coinInstanceRepresentations.map((row) => [
		row.representation,
		row,
	])
)

export const bridgeRouteStepTypeByWire = Object.fromEntries(
	bridgeRouteStepTypes.map((row) => [
		row.stepType,
		row,
	])
)

export const bridgeRouteTagByTag = Object.fromEntries(
	bridgeRouteTags.map((row) => [
		row.tag,
		row,
	])
)
