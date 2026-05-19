import {
	defineEntityFieldResolver,
	defineEntityResolver,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { normalize as ensNormalizeNode, toString as ensToString } from '@tevm/voltaire/Ens'
import { singleFlight } from '$/lib/singleFlight.ts'
import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const nullableBigIntFromSubgraphScalar = (value: JsonValue) => (
	typeof value === 'string' || typeof value === 'number' ?
		BigInt(value)
	:	null
)

const ensNameEntityFromSubgraphNameField = (
	nameValue: string | null | undefined,
): import('$/schema/$schema.ts').Entity<typeof schema, EntityType.EnsName> | null => (
	typeof nameValue === 'string' && nameValue.length > 0 ?
		{
			[EntityMetaKey.Id]: {
				name: nameValue,
			},
		}
	:	null
)

export default {
	source: Source.TheGraph_Graphql,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EnsName,
			resolve: async (entityId, context) => {
				const { getEnsName } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.TheGraph_Graphql)
				const normalizedName = ensToString(ensNormalizeNode(entityId.name.trim()))
				const matchingEnsDomain = (
					await singleFlight(getEnsName)({
						publicEnv,
						name: normalizedName,
					})
				).find((candidate) => candidate.name === normalizedName)
				if (matchingEnsDomain == null) throw new Error('TheGraph_Graphql: ENS name not in subgraph')

				const parentEnsNameEntity = ensNameEntityFromSubgraphNameField(matchingEnsDomain.parent?.name)
				const subdomainEnsNameEntities = (
					matchingEnsDomain.subdomains
						.map((subdomain) => ensNameEntityFromSubgraphNameField(subdomain.name))
						.filter((entity) => entity != null)
				)
				const ttlBigInt = matchingEnsDomain.ttl != null ?
						nullableBigIntFromSubgraphScalar(matchingEnsDomain.ttl)
					:	null
				const createdAtBigInt = matchingEnsDomain.createdAt != null ?
						nullableBigIntFromSubgraphScalar(matchingEnsDomain.createdAt)
					:	null
				const expiryDateBigInt = matchingEnsDomain.expiryDate != null ?
						nullableBigIntFromSubgraphScalar(matchingEnsDomain.expiryDate)
					:	null

				return {
					...(typeof matchingEnsDomain.labelName === 'string' && matchingEnsDomain.labelName !== '' && { labelName: matchingEnsDomain.labelName }),
					...(typeof matchingEnsDomain.labelhash === 'string' && matchingEnsDomain.labelhash !== '' && { labelhash: matchingEnsDomain.labelhash }),
					...(parentEnsNameEntity != null && { $parent: parentEnsNameEntity }),
					...(subdomainEnsNameEntities.length > 0 && { $$subdomains: subdomainEnsNameEntities }),
					...(typeof matchingEnsDomain.subdomainCount === 'number' && { subdomainCount: matchingEnsDomain.subdomainCount }),
					...(matchingEnsDomain.resolver?.contentHash != null && { contentHash: String(matchingEnsDomain.resolver.contentHash) }),
					...(matchingEnsDomain.resolver?.texts != null && matchingEnsDomain.resolver.texts.length > 0 && {
						resolverTextKeys: matchingEnsDomain.resolver.texts.filter((value) => value != null).map(String),
					}),
					...(matchingEnsDomain.resolver?.coinTypes != null && matchingEnsDomain.resolver.coinTypes.length > 0 && {
						resolverCoinTypes: matchingEnsDomain.resolver.coinTypes.filter((value) => value != null).map((value) => String(value)),
					}),
					...(ttlBigInt != null && { ttl: ttlBigInt }),
					isMigrated: matchingEnsDomain.isMigrated,
					...(createdAtBigInt != null && { createdAt: createdAtBigInt }),
					...(expiryDateBigInt != null && { expiryDate: expiryDateBigInt }),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Actor,
			fieldName: '$$ensNamesOwned',
			resolve: async (entityId, context) => {
				const { getEnsDomainsByOwner } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.TheGraph_Graphql)
				return (
					(await singleFlight(getEnsDomainsByOwner)({
						publicEnv,
						owner: zeroExLowerCase(entityId.address),
					}))
						.map((domain) => ensNameEntityFromSubgraphNameField(domain.name))
						.filter((entity) => entity != null)
				)
			},
		}),
	],
}
