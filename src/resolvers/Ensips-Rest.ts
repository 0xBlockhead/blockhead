import type {
	EntityFieldResolver,
	EntityFieldResolverContext,
} from '$/resolvers/$EntityFieldResolver.ts'
import {
	sliceRowsForResolverSubset,
	subsetFilterEqAsNumber,
	subsetFilterEqValue,
} from '$/data/tanstackDb/resolverLoadSubset.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ProposalRealm } from '$/constants/Proposal/ProposalRealm.ts'
import { ProposalCategory } from '$/constants/Proposal/ProposalCategory.ts'
import { getEnsipsGithubContents } from '$/sources/Ensips/Github/queries.ts'
import type { GhFile } from '$/sources/Github/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

export default {
	source: Source.Ensips,
	entityResolvers: [],
	entityFieldResolvers: [
		{
			entityType: EntityType._Global,
			field: '$$proposalsEnsip',
			resolve: async (_entityId, context?: EntityFieldResolverContext) => {
				const filters = context?.loadSubset?.filters ?? []
				const data = await getEnsipsGithubContents()
				if (!Array.isArray(data)) throw new Error('GitHub (ENSIPs): directory response is not an array')
				const files = data.filter((f: GhFile) => f.type === 'file' && f.name.endsWith('.md'))
				const rows = []
				for (const f of files) {
					const m = f.name.match(/^(\d+)\.md$/)
					const num = m != null ? parseInt(m[1], 10) : null
					if (num == null) continue
					rows.push({
						$id: {
							realm: ProposalRealm.Ens,
							kind: ProposalCategory.Ensip,
							number: num,
						},
						category: null,
						body: null,
					})
				}
				rows.sort((a, b) => a.$id.number - b.$id.number)
				const numEq = subsetFilterEqAsNumber(filters, 'number')
				const numIdEq = subsetFilterEqAsNumber(filters, '$id.number')
				const kindEq = subsetFilterEqValue(filters, '$id.kind')
				const realmEq = subsetFilterEqValue(filters, '$id.realm')
				return sliceRowsForResolverSubset(
					rows.filter(
						(e) =>
							(numEq == null || e.$id.number === numEq) &&
							(numIdEq == null || e.$id.number === numIdEq) &&
							(kindEq == null || e.$id.kind === kindEq) &&
							(realmEq == null || e.$id.realm === realmEq),
					),
					context?.loadSubset,
				)
			},
		},
	],
} satisfies {
	source: Source
	entityResolvers: readonly []
	entityFieldResolvers: readonly EntityFieldResolver<
		EntityType._Global,
		'$$proposalsEnsip'
	>[]
}
