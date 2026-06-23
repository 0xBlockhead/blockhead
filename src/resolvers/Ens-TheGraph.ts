import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { BlockheadEnsNameSearchSelector } from '$/schema/BlockheadEnsNameSearch.ts'
import { EnsNameSelector } from '$/schema/EnsName.ts'
import { EvmAccountSelector } from '$/schema/EvmAccount.ts'
import { Source } from '$/sources/Source.ts'
import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'

const normalizedEnsSearchQuery = (query: string): string => {
	const trimmedQuery = query.trim()
	if (trimmedQuery === '') throw new Error('TheGraph_Graphql: empty ENS search query')
	try {
		return ensToString(ensNormalizeNode(trimmedQuery))
	} catch {
		return trimmedQuery.toLowerCase()
	}
}

export default {
	source: Source.TheGraph_Graphql,

	resolvers: [
		defineResolver(Source.TheGraph_Graphql, {
			entityType: EntityType.EnsName,
			resolve: {
				[EnsNameSelector.NormalizedName]: async ({ name }, context) => {
					const { getName } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')
					const normalizedName = ensToString(ensNormalizeNode(name))
					const matchingEnsDomain = (
						await getName({
							publicEnv: context.publicEnv,
							name: normalizedName,
						})
					).find((candidate) => candidate.name === normalizedName)
					if (matchingEnsDomain == null)
						throw new Error('TheGraph_Graphql: ENS name not in subgraph')

					const parentName = matchingEnsDomain.parent?.name
					const subdomainEnsNameEntities = matchingEnsDomain.subdomains.flatMap((subdomain) => (
						subdomain.name != null && subdomain.name !== '' ?
							[{
								[EntityMetaKey.Selector]: {
									name: subdomain.name,
								},
							}]
						:
							[]
					))

					return {
						name: normalizedName,
						normalizedName,
						...(matchingEnsDomain.labelName != null
							&& matchingEnsDomain.labelName !== '' && {
							labelName: matchingEnsDomain.labelName,
						}),
						...(matchingEnsDomain.labelhash != null
							&& matchingEnsDomain.labelhash !== '' && {
							labelhash: String(matchingEnsDomain.labelhash),
						}),
						...(parentName != null && parentName !== '' && {
							$parent: {
								[EntityMetaKey.Selector]: {
									name: parentName,
								},
							},
						}),
						...(subdomainEnsNameEntities.length > 0 && {
							$$subdomains: subdomainEnsNameEntities,
						}),
					}
				},
			},
		})({
			fields: {
				name: (ensName) => ensName.name,
				normalizedName: (ensName) => ensName.normalizedName,
				labelName: (ensName) => ensName.labelName,
				labelhash: (ensName) => ensName.labelhash,
				$parent: (ensName) => ensName.$parent,
				$$subdomains: (ensName) => ensName.$$subdomains ?? [],
			},
		}),

		defineResolver(Source.TheGraph_Graphql, {
			entityType: EntityType.EvmAccount,
			resolve: {
				[EvmAccountSelector.AddressInteropAddress]: async ({ address }, context) => {
					const { getDomainsByOwner } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')
					return (
						(await getDomainsByOwner({
							publicEnv: context.publicEnv,
							owner: zeroExLowerCase(address),
						}))
							.flatMap((domain) => (
								domain.name != null && domain.name !== '' ?
									[{
										[EntityMetaKey.Selector]: {
											name: domain.name,
										},
									}]
								:
									[]
							))
					)
				},
			},
		})({
			fields: {
				$$ensNamesOwned: (ensNamesOwned) => ensNamesOwned,
			},
		}),

		defineResolver(Source.TheGraph_Graphql, {
			entityType: EntityType.BlockheadEnsNameSearch,
			resolve: {
				[BlockheadEnsNameSearchSelector.Query]: async ({ query: querySelector }, context) => {
				const { getDomainsContaining } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')
				const limit = resolverContextRowLimit(context)
				const query = normalizedEnsSearchQuery(querySelector)
				return (
					(await getDomainsContaining({
						publicEnv: context.publicEnv,
						query,
						limit,
					}))
						.flatMap((domain) => (
							domain.name != null && domain.name !== '' ?
								[{
									[EntityMetaKey.Selector]: {
										name: domain.name,
									},
								}]
							:
								[]
						))
				)
			}
			},
		})({
			fields: {
				$$matchingNames: (matchingNames) => matchingNames,
			},
		}),
	],
}
