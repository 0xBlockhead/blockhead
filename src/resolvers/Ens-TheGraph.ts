import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { Entity } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { BlockheadEnsNameSearchSelector } from '$/schema/BlockheadEnsNameSearch.ts'
import { EnsNameSelector } from '$/schema/EnsName.ts'
import { EnsRecordSelector } from '$/schema/EnsRecord.ts'
import { EvmAccountSelector } from '$/schema/EvmAccount.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { hexLowerOfByteSize, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'

const normalizedEnsSearchQuery = (query: string): string => {
	const trimmedQuery = query.trim()
	if (trimmedQuery === '') throw new Error('TheGraph_Graphql: empty ENS search query')
	try {
		return ensToString(ensNormalizeNode(trimmedQuery))
	} catch {
		return trimmedQuery.toLowerCase()
	}
}

const bigintFromSubgraphScalar = (value: unknown) => (
	value == null ?
		null
	:
		BigInt(String(value))
)

const evmAccountFromSubgraphAccount = (
	account: { id: string } | null | undefined
): Entity<typeof schema, EntityType.EvmAccount> | null => {
	const address = (
		account?.id == null ?
			undefined
		:
			hexLowerOfByteSize(account.id, 20)
	)
	return address == null ?
		null
	:
		{
			[EntityMetaKey.Selector]: {
				address,
			},
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
					const resolverAddress = hexLowerOfByteSize(
						String(matchingEnsDomain.resolver?.address ?? ''),
						20
					)
					const resolvedActor = evmAccountFromSubgraphAccount(
						matchingEnsDomain.resolvedAddress
						?? matchingEnsDomain.resolver?.addr
					)
					const ownerActor = evmAccountFromSubgraphAccount(matchingEnsDomain.owner)
					const resolverTextKeys = matchingEnsDomain.resolver?.texts?.map(String) ?? []
					const resolverCoinTypes = matchingEnsDomain.resolver?.coinTypes
						?.filter((coinType) => coinType != null)
						.map(String) ?? []
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
					const recordEntities = [
						...resolverTextKeys.map((textKey) => ({
							[EntityMetaKey.Selector]: {
								$name: {
									name: normalizedName,
								},
								recordKey: `text:${textKey}`,
							},
						})),
						...resolverCoinTypes.map((coinType) => ({
							[EntityMetaKey.Selector]: {
								$name: {
									name: normalizedName,
								},
								recordKey: `coin:${coinType}`,
							},
						})),
					]
					const ttl = bigintFromSubgraphScalar(matchingEnsDomain.ttl)

					return {
						name: normalizedName,
						normalizedName,
						node: String(matchingEnsDomain.id),
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
						...(resolverAddress != null && {
							$resolverContract: {
								[EntityMetaKey.Selector]: {
									$network: {
										caip2: {
											namespace: 'eip155',
											reference: '1',
										},
									},
									address: resolverAddress,
								},
							},
						}),
						...(resolvedActor != null && {
							$subgraphResolvedActor: resolvedActor,
						}),
						...(ownerActor != null && {
							$ownerActor: ownerActor,
						}),
						...(resolverTextKeys.length > 0 && {
							resolverTextKeys,
						}),
						...(resolverCoinTypes.length > 0 && {
							resolverCoinTypes,
						}),
						...(recordEntities.length > 0 && {
							$$records: recordEntities,
						}),
						...(ttl != null && {
							ttl,
						}),
						isMigrated: matchingEnsDomain.isMigrated,
					}
				},
			},
		})({
			fields: {
				name: (ensName) => ensName.name,
				normalizedName: (ensName) => ensName.normalizedName,
				node: (ensName) => ensName.node,
				labelName: (ensName) => ensName.labelName,
				labelhash: (ensName) => ensName.labelhash,
				$parent: (ensName) => ensName.$parent,
				$$subdomains: (ensName) => ensName.$$subdomains ?? [],
				$resolverContract: (ensName) => ensName.$resolverContract,
				$subgraphResolvedActor: (ensName) => ensName.$subgraphResolvedActor,
				$ownerActor: (ensName) => ensName.$ownerActor,
				resolverTextKeys: (ensName) => ensName.resolverTextKeys,
				resolverCoinTypes: (ensName) => ensName.resolverCoinTypes,
				$$records: (ensName) => ensName.$$records ?? [],
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
			entityType: EntityType.EnsRecord,
			resolve: {
				[EnsRecordSelector.NameRecordKey]: ({ recordKey }) => {
					const coinType = recordKey.startsWith('coin:') ?
						Number(recordKey.slice('coin:'.length))
					:
						undefined

					return {
						recordKey,
						recordKind: recordKey.startsWith('coin:') ? 'coin' : 'text',
						...(coinType == null || Number.isNaN(coinType) ? {} : { coinType }),
					}
				},
			},
		})({
			fields: {
				recordKey: (ensRecord) => ensRecord.recordKey,
				recordKind: (ensRecord) => ensRecord.recordKind,
				coinType: (ensRecord) => ensRecord.coinType,
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
