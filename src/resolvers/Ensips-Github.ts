import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { ProposalCategory } from '$/constants/Proposal/ProposalCategory.ts'
import { ProposalRealm } from '$/constants/Proposal/ProposalRealm.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { GhFile } from '$/sources/Github/Rest/types.ts'
import {
	parseFrontmatter,
	stripFrontmatter,
} from '$/sources/Github/Rest/client.ts'
import { Source } from '$/sources/$Sources.ts'

const proposalBodyResolverNotApplicable = () => {
	throw new Error('Proposal body resolver not applicable')
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Proposal,
			source: Source.Ensips,
			resolve: async (entityId) => {
				if (entityId.category !== ProposalCategory.Ensip) proposalBodyResolverNotApplicable()
				if (typeof entityId.number !== 'number' || !Number.isFinite(entityId.number)) return {}
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const { getEnsipProposalMarkdownText } = await import('$/sources/Ensips/Github/queries.ts')
				const text = await singleFlight(getEnsipProposalMarkdownText)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const category = parseFrontmatter(text).category?.trim()
				return {
					category: category != null && category !== '' ? category : null,
					body: body.length > 0 ? body : null,
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposalsEnsip',
			source: Source.Ensips,
			resolve: async (_entityId) => {
				const { getEnsipsGithubContents } = await import('$/sources/Ensips/Github/queries.ts')
				const data = await getEnsipsGithubContents()
				if (!Array.isArray(data)) throw new Error('GitHub (ENSIPs): directory response is not an array')
				const files = data.filter((f: GhFile) => f.type === 'file' && f.name.endsWith('.md'))
				const rows = []
				for (const f of files) {
					const m = f.name.match(/^(\d+)\.md$/)
					const num = m != null ? parseInt(m[1], 10) : null
					if (num == null) continue
					rows.push({
						[EntityMetaKey.Id]: {
							realm: ProposalRealm.Ens,
							category: ProposalCategory.Ensip,
							number: num,
						},
					})
				}
				rows.sort((a, b) => a[EntityMetaKey.Id].number - b[EntityMetaKey.Id].number)
				return rows
			},
		}),
	],
}
