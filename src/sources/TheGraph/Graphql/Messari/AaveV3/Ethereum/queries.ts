import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { messariAaveV3EthereumMarketsDefaultFirst } from '$/sources/TheGraph/Graphql/constants.ts'
import { graphql, queryMessariAaveV3Ethereum } from '$/sources/TheGraph/Graphql/Messari/AaveV3/Ethereum/client.ts'

const Token = graphql(`
	fragment AaveV3EthereumToken on Token @_unmask {
		id
		name
		symbol
		decimals
		lastPriceUSD
	}
`)

const InterestRate = graphql(`
	fragment AaveV3EthereumInterestRate on InterestRate @_unmask {
		side
		type
		rate
	}
`)

const Market = graphql(`
	fragment AaveV3EthereumMarket on Market @_unmask {
		id
		name
		isActive
		canBorrowFrom
		totalValueLockedUSD
		totalDepositBalanceUSD
		totalBorrowBalanceUSD
		inputTokenPriceUSD
		inputToken {
			...AaveV3EthereumToken
		}
		outputToken {
			...AaveV3EthereumToken
		}
		rates {
			...AaveV3EthereumInterestRate
		}
	}
`, [
	Token,
	InterestRate,
])

export const getMessariAaveV3EthereumProtocol = async (
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>,
) => (
	(
		await queryMessariAaveV3Ethereum(
			publicEnv,
			graphql(`
				query MessariAaveV3EthereumProtocol {
					lendingProtocols(
						first: 1
						where: {
							slug: "aave-v3"
							network: MAINNET
						}
					) {
						id
						protocol
						name
						slug
						schemaVersion
						subgraphVersion
						methodologyVersion
						network
						totalValueLockedUSD
						totalDepositBalanceUSD
						totalBorrowBalanceUSD
						cumulativeDepositUSD
						cumulativeBorrowUSD
						totalPoolCount
						openPositionCount
						markets {
							...AaveV3EthereumMarket
						}
					}
				}
			`, [
				Market,
			]),
		)
	).lendingProtocols[0]
)

export const getMessariAaveV3EthereumMarkets = async (
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>,
	{
		first = messariAaveV3EthereumMarketsDefaultFirst,
	}: {
		first?: number
	} = {},
) => (
	(
		await queryMessariAaveV3Ethereum(
			publicEnv,
			graphql(`
				query MessariAaveV3EthereumMarkets(
					$first: Int!
				) {
					markets(
						first: $first
						orderBy: totalValueLockedUSD
						orderDirection: desc
						where: {
							isActive: true
							canBorrowFrom: true
						}
					) {
						...AaveV3EthereumMarket
					}
				}
			`, [
				Market,
			]),
			{
				first,
			},
		)
	).markets
)

export const getMessariAaveV3EthereumMarket = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>
	id: string
}) => (
	(
		await queryMessariAaveV3Ethereum(
			publicEnv,
			graphql(`
				query MessariAaveV3EthereumMarket(
					$id: Bytes!
				) {
					market(
						id: $id
					) {
						...AaveV3EthereumMarket
					}
				}
			`, [
				Market,
			]),
			{
				id,
			},
		)
	).market
)
