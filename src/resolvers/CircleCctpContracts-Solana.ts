import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.CircleCctpContracts_Solana,

	resolvers: [
		defineResolver({
			entityType: EntityType.CctpDomainSupport,
			resolve: {
				CctpVersionDomainId: {
					resolve: async ({
						cctpVersion,
						domainId,
					}) => {
						const {
							irisCctpVersion,
							solanaDomainSupportByDomainId,
						} = await import('$/sources/CircleCctp/Catalog/constants.ts')
						if (cctpVersion !== irisCctpVersion)
							throw new Error(`CircleCctpContracts_Solana: unsupported cctpVersion ${cctpVersion}`)
						if (!Number.isSafeInteger(domainId) || domainId < 0)
							throw new Error(`CircleCctpContracts_Solana: invalid domain id ${domainId}`)

						const row = solanaDomainSupportByDomainId[domainId]
						if (row == null)
							throw new Error(`CircleCctpContracts_Solana: no Solana CCTP domain ${domainId}`)

						return {
							cctpVersion: row.cctpVersion,
							domainId: row.domainId,
							name: row.name,
							$network: {
								[EntityMetaKey.Selector]: {
									caip2: row.caip2,
								},
							},
							supportedTokens: [...row.supportedTokens],
							tokenMessengerAddress: row.tokenMessengerAddress,
							messageTransmitterAddress: row.messageTransmitterAddress,
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
		}),
	],
} satisfies RegisteredSourceResolverModule
