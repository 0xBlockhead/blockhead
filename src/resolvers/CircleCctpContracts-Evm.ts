import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const irisCctpVersion = 2

export default {
	source: Source.CircleCctpContracts_Evm,

	resolvers: [
		defineResolver({
			entityType: EntityType.CctpDomainSupport,
			resolve: {
				CctpVersionDomainId: {
					resolve: async ({
						cctpVersion,
						domainId,
					}) => {
						if (cctpVersion !== irisCctpVersion)
							throw new Error(`CircleCctpContracts_Evm: unsupported cctpVersion ${cctpVersion}`)
						if (!Number.isSafeInteger(domainId) || domainId < 0)
							throw new Error(`CircleCctpContracts_Evm: invalid domain id ${domainId}`)

						const { getEvmDomainSupport } = await import('$/sources/CircleCctp/Catalog/queries.ts')
						const row = getEvmDomainSupport(domainId)
						if (row == null)
							throw new Error(`CircleCctpContracts_Evm: no EVM CCTP domain ${domainId}`)

						return {
							cctpVersion: row.cctpVersion,
							domainId: row.domainId,
							name: row.name,
							$network: {
								[EntityMetaKey.Selector]: {
									caip2: {
										namespace: 'eip155' as const,
										reference: String(row.chainId),
									},
								},
							},
							supportedTokens: [...row.supportedTokens],
							tokenMessengerAddress: row.tokenMessengerAddress,
							messageTransmitterAddress: row.messageTransmitterAddress,
							tokenMinterAddress: row.tokenMinterAddress,
						}
					},
				},
			},
		})({
			cctpVersion: (domain) => domain.cctpVersion,
			domainId: (domain) => domain.domainId,
			name: (domain) => domain.name,
			$network: (domain) => domain.$network,
			supportedTokens: (domain) => domain.supportedTokens,
			tokenMessengerAddress: (domain) => domain.tokenMessengerAddress,
			messageTransmitterAddress: (domain) => domain.messageTransmitterAddress,
			tokenMinterAddress: (domain) => domain.tokenMinterAddress,
		}),
	],
} satisfies RegisteredSourceResolverModule
