import { schema } from '$/schema/$schema.ts'

import AlliumRestResolvers from '$/resolvers/Allium-Rest.ts'
import BlockscoutRestResolvers from '$/resolvers/Blockscout-Rest.ts'
import CaipsGithubResolvers from '$/resolvers/Caips-Github.ts'
import ChainlistRestResolvers from '$/resolvers/Chainlist-Rest.ts'
import CoingeckoRestResolvers from '$/resolvers/Coingecko-Rest.ts'
import CoinMarketCapRestResolvers from '$/resolvers/CoinMarketCap-Rest.ts'
import CoinpaprikaOpenApiResolvers from '$/resolvers/Coinpaprika-OpenApi.ts'
import ConstantsResolvers from '$/resolvers/Constants.ts'
import DexscreenerOpenApiResolvers from '$/resolvers/Dexscreener-OpenApi.ts'
import DefillamaRestResolvers from '$/resolvers/Defillama-Rest.ts'
import DuneRestResolvers from '$/resolvers/Dune-Rest.ts'
import EnsipsGithubResolvers from '$/resolvers/Ensips-Github.ts'
import EthereumEipsGithubResolvers from '$/resolvers/EthereumEips-Github.ts'
import FarcasterRestResolvers from '$/resolvers/Farcaster-Rest.ts'
import LifiRestResolvers from '$/resolvers/Lifi-Rest.ts'
import LocalResolvers from '$/resolvers/Local.ts'
import NeynarRestResolvers from '$/resolvers/Neynar-Rest.ts'
import OpenchainRestResolvers from '$/resolvers/Openchain-Rest.ts'
import SnapchainRestResolvers from '$/resolvers/Snapchain-Rest.ts'
import SourcifyRestResolvers from '$/resolvers/Sourcify-Rest.ts'
import VoltaireJsonRpcResolvers from '$/resolvers/Voltaire-JsonRpc.ts'

const resolverModules = [
	LocalResolvers,
	ConstantsResolvers,
	AlliumRestResolvers,
	CaipsGithubResolvers,
	ChainlistRestResolvers,
	CoingeckoRestResolvers,
	CoinMarketCapRestResolvers,
	CoinpaprikaOpenApiResolvers,
	DexscreenerOpenApiResolvers,
	DefillamaRestResolvers,
	DuneRestResolvers,
	EnsipsGithubResolvers,
	EthereumEipsGithubResolvers,
	BlockscoutRestResolvers,
	LifiRestResolvers,
	FarcasterRestResolvers,
	NeynarRestResolvers,
	SnapchainRestResolvers,
	OpenchainRestResolvers,
	SourcifyRestResolvers,
	VoltaireJsonRpcResolvers,
]

// const resolverModules = [
// 	(await import('$/resolvers/Local.ts')).default,
// 	(await import('$/resolvers/Caips-Github.ts')).default,
// 	(await import('$/resolvers/Chainlist-Rest.ts')).default,
// 	(await import('$/resolvers/Ensips-Github.ts')).default,
// 	(await import('$/resolvers/EthereumEips-Github.ts')).default,
// 	(await import('$/resolvers/Evm-JsonRpc.ts')).default,
// 	(await import('$/resolvers/Openchain-Rest.ts')).default,
// 	(await import('$/resolvers/Voltaire-JsonRpc.ts')).default,
// ]

export const entityResolvers = (
	resolverModules.flatMap((m) => [...m.entityResolvers])
)

export const entityFieldResolvers = (
	resolverModules.flatMap((m) => [...m.entityFieldResolvers])
)

export const entityResolversByEntityType = Object.groupBy(
	entityResolvers,
	(entityResolver) => entityResolver.entityType,
)

export const entityFieldResolversByEntityType = Object.groupBy(
	entityFieldResolvers,
	(fieldResolver) => fieldResolver.entityType,
)

export const entityFieldResolversByEntityTypeAndFieldName = Object.fromEntries(
	Object.entries(entityFieldResolversByEntityType)
		.map(([entityType, entityFieldResolvers]) => [
			entityType,
			Object.groupBy(
				entityFieldResolvers,
				(fieldResolver) => fieldResolver.fieldName,
			),
		]),
)
