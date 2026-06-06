import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import { singleFlight } from '$/lib/singleFlight.ts'
import { hexLowerOfByteSize, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const bigintFromSubgraphScalar = (value: unknown) => (
	value == null ?
		null
	:
		BigInt(String(value))
)

const epochMsFromSubgraphScalar = (value: unknown) => {
	const epochSeconds = bigintFromSubgraphScalar(value)
	return (
		epochSeconds == null ?
			null
		:
			epochSeconds * 1000n
	)
}

const normalizedEnsSearchQuery = (query: string): string => {
	const trimmedQuery = query.trim()
	if (trimmedQuery === '') throw new Error('TheGraph_Graphql: empty ENS search query')
	try {
		return ensToString(ensNormalizeNode(trimmedQuery))
	} catch {
		return trimmedQuery.toLowerCase()
	}
}

const actorEntityFromSubgraphAccount = (
	account: { id: string } | null | undefined,
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
				[EntityMetaKey.Id]: {
					address,
				},
			}
}

export default {
	source: Source.TheGraph_Graphql,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EnsName,
			resolve: async (entityId, context) => {
				const { getName } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.TheGraph_Graphql)
				const normalizedName = ensToString(ensNormalizeNode(entityId.name))
				const matchingEnsDomain = (
					await singleFlight(getName)({
						publicEnv,
						name: normalizedName,
					})
				).find((candidate) => candidate.name === normalizedName)
				if (matchingEnsDomain == null) throw new Error('TheGraph_Graphql: ENS name not in subgraph')

				const parentName = matchingEnsDomain.parent?.name
				const parentEnsNameEntity = (
					parentName != null && parentName !== '' ?
						{
							[EntityMetaKey.Id]: {
								name: parentName,
							},
						}
					:
						null
				)
				const subdomainEnsNameEntities = (
					matchingEnsDomain.subdomains.flatMap((subdomain) => (
						subdomain.name != null && subdomain.name !== '' ?
							[{
								[EntityMetaKey.Id]: {
									name: subdomain.name,
								},
							}]
						:
							[]
					))
				)
				const ttlBigInt = bigintFromSubgraphScalar(matchingEnsDomain.ttl)
				const createdAtBigInt = epochMsFromSubgraphScalar(matchingEnsDomain.createdAt)
				const expiryDateBigInt = epochMsFromSubgraphScalar(matchingEnsDomain.expiryDate)

				const subgraphResolvedActor = actorEntityFromSubgraphAccount(matchingEnsDomain.resolvedAddress)
				const subgraphOwnerActor = actorEntityFromSubgraphAccount(matchingEnsDomain.owner)
				const registrantActor = actorEntityFromSubgraphAccount(
					matchingEnsDomain.registrant
					?? matchingEnsDomain.registration?.registrant,
				)
				const wrappedOwnerActor = actorEntityFromSubgraphAccount(matchingEnsDomain.wrappedOwner)
				const wrappedExpiryDateBigInt = epochMsFromSubgraphScalar(
					matchingEnsDomain.wrappedDomain?.expiryDate,
				)
				const registrationDateBigInt = epochMsFromSubgraphScalar(
					matchingEnsDomain.registration?.registrationDate,
				)
				const registrationCostBigInt = bigintFromSubgraphScalar(
					matchingEnsDomain.registration?.cost,
				)
				const registrationExpiryDateBigInt = epochMsFromSubgraphScalar(
					matchingEnsDomain.registration?.expiryDate,
				)

				return {
					name: normalizedName,
					subgraphId: matchingEnsDomain.id,
					...(matchingEnsDomain.labelName != null
						&& matchingEnsDomain.labelName !== '' && {
						labelName: matchingEnsDomain.labelName,
					}),
					...(matchingEnsDomain.labelhash != null
						&& matchingEnsDomain.labelhash !== '' && {
						labelhash: String(matchingEnsDomain.labelhash),
					}),
					...(parentEnsNameEntity != null && { $parent: parentEnsNameEntity }),
					...(subdomainEnsNameEntities.length > 0 && { $$subdomains: subdomainEnsNameEntities }),
						subdomainCount: matchingEnsDomain.subdomainCount,
					...(subgraphResolvedActor != null && { $subgraphResolvedActor: subgraphResolvedActor }),
					...(subgraphOwnerActor != null && { $subgraphOwnerActor: subgraphOwnerActor }),
					...(registrantActor != null && { $registrantActor: registrantActor }),
					...(wrappedOwnerActor != null && { $wrappedOwnerActor: wrappedOwnerActor }),
					...(wrappedExpiryDateBigInt != null && { wrappedExpiryDate: wrappedExpiryDateBigInt }),
					...(matchingEnsDomain.resolver?.contentHash != null && {
						contentHash: String(matchingEnsDomain.resolver.contentHash),
					}),
					...(matchingEnsDomain.resolver?.texts != null
						&& matchingEnsDomain.resolver.texts.length > 0 && {
						resolverTextKeys: matchingEnsDomain.resolver.texts
							.map(String),
					}),
					...(matchingEnsDomain.resolver?.coinTypes != null
						&& matchingEnsDomain.resolver.coinTypes.length > 0 && {
						resolverCoinTypes: matchingEnsDomain.resolver.coinTypes
							.filter((value) => value != null)
							.map((value) => String(value)),
					}),
					...(ttlBigInt != null && { ttl: ttlBigInt }),
					isMigrated: matchingEnsDomain.isMigrated,
					...(createdAtBigInt != null && { createdAt: createdAtBigInt }),
					...(expiryDateBigInt != null && { expiryDate: expiryDateBigInt }),
					...(matchingEnsDomain.wrappedDomain != null && {
						wrappedFuses: matchingEnsDomain.wrappedDomain.fuses,
					}),
					...(registrationDateBigInt != null && { registrationDate: registrationDateBigInt }),
					...(registrationCostBigInt != null && { registrationCost: registrationCostBigInt }),
					...(registrationExpiryDateBigInt != null && {
						registrationExpiryDate: registrationExpiryDateBigInt,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EnsSearch,
			resolve: async (entityId) => {
				normalizedEnsSearchQuery(entityId.query)
				return {}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.EvmAccount,
			fieldName: '$$ensNamesOwned',
			resolve: async (entityId, context) => {
				const { getDomainsByOwner } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.TheGraph_Graphql)
				return (
					(await singleFlight(getDomainsByOwner)({
						publicEnv,
						owner: zeroExLowerCase(entityId.address),
					}))
						.flatMap((domain) => (
							domain.name != null && domain.name !== '' ?
								[{
									[EntityMetaKey.Id]: {
										name: domain.name,
									},
								}]
							:
								[]
						))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.EnsSearch,
			fieldName: '$$ensNames',
			resolve: async (entityId, context) => {
				const { getDomainsContaining } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.TheGraph_Graphql)
				const limit = resolverLoadSubsetRowLimit(context)
				const query = normalizedEnsSearchQuery(entityId.query)
				return (
					(await singleFlight(getDomainsContaining)({
						publicEnv,
						query,
						limit,
					}))
						.flatMap((domain) => (
							domain.name != null && domain.name !== '' ?
								[{
									[EntityMetaKey.Id]: {
										name: domain.name,
									},
								}]
							:
								[]
						))
				)
			},
		}),
	],
}
