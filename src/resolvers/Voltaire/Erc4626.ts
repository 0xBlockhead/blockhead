import { networks } from '$/constants/Network.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const chainIdFromNetwork = (network: NetworkId) => {
	const caip2 = (
		'caip2' in network ?
			network.caip2
		:
			((networkRow) => (
				networkRow != null && 'caip2' in networkRow ?
					networkRow.caip2
				:
					undefined
			))(networks.find(({ slug }) => slug === network.slug))
	)
	if (caip2?.namespace !== 'eip155')
		throw new Error('Voltaire_JsonRpc: ERC-4626 network selector does not identify an EIP-155 network')

	const chainId = Number(caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 0)
		throw new Error(`Voltaire_JsonRpc: invalid ERC-4626 EIP-155 chain id ${caip2.reference}`)

	return chainId
}

const withTransports = async <_Result>(
	chainId: number,
	fieldName: string,
	resolve: (getCall: (call: {
		to: `0x${string}`
		input: `0x${string}`
		blockTag?: `0x${string}` | 'latest' | 'pending' | 'safe' | 'finalized'
	}) => Promise<`0x${string}`>) => Promise<_Result>
) => {
	const transports = (
		await import('$/sources/Voltaire/JsonRpc/queries.ts')
	).voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
	if (transports.length === 0)
		throw new Error(`Voltaire_JsonRpc: no JSON-RPC URL for ${fieldName} on chain ${String(chainId)}`)

	const errors: string[] = []
	for (const transport of transports) {
		try {
			return await resolve(transport.getCall)
		} catch (error) {
			errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	throw new Error(`Voltaire_JsonRpc: all JSON-RPC endpoints failed for ${fieldName} on chain ${String(chainId)}: ${errors.join('; ')}`)
}

export const erc4626Resolvers = [
	defineResolver({
		entityType: EntityType.Erc4626Vault,
		resolve: {
			Contract: {
				resolve: async ({ $contract }) => {
					const { getErc4626VaultIdentity } = await import('$/sources/Erc4626/Contracts/queries.ts')
					return withTransports(
						chainIdFromNetwork($contract.$network),
						'Erc4626Vault',
						async (getCall) => {
							const identity = await getErc4626VaultIdentity({
								getCall,
								vaultAddress: $contract.address,
							})

							return {
								$network: {
									[EntityMetaKey.Selector]: $contract.$network,
								},
								$asset: {
									[EntityMetaKey.Selector]: {
										$network: $contract.$network,
										type: CoinInstanceType.Erc20Token,
										$contract: {
											$network: $contract.$network,
											address: identity.assetAddress,
										},
									},
								},
								$shareToken: {
									[EntityMetaKey.Selector]: {
										$network: $contract.$network,
										type: CoinInstanceType.Erc20Token,
										$contract,
									},
								},
							}
						}
					)
				},
			},
		},
	})({
		$network: (snapshot) => snapshot.$network,
		$asset: (snapshot) => snapshot.$asset,
		$shareToken: (snapshot) => snapshot.$shareToken,
	}),

	defineResolver({
		entityType: EntityType.Erc4626Vault_Block,
		resolve: {
			VaultBlockNumberSource: {
				resolve: async ({
					$vault,
					blockNumber,
				}) => {
					const { getErc4626VaultBlockState } = await import('$/sources/Erc4626/Contracts/queries.ts')
					return withTransports(
						chainIdFromNetwork($vault.$contract.$network),
						'Erc4626Vault_Block',
						async (getCall) => getErc4626VaultBlockState({
							getCall,
							vaultAddress: $vault.$contract.address,
							blockNumber: BigInt(blockNumber),
						})
					)
				},
			},
		},
	})({
		totalAssets: (snapshot) => snapshot.totalAssets,
		totalSupply: (snapshot) => snapshot.totalSupply,
	}),
] as const
