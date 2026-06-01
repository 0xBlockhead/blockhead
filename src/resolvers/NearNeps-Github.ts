import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const nearNepRows = async (entries: { type: string, name: string }[]) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^nep-(?<proposalNumber>\\d{4})\\.md$').exec(githubContent.name)?.groups?.proposalNumber
		return githubContent.type !== 'file' || proposalNumberRaw == null ?
			[]
		:
			[{
				[EntityMetaKey.Id]: {
					realm: SpecificationRealm.Near,
					category: ProposalCategory.Nep,
					number: parseInt(proposalNumberRaw, 10),
				},
			}]
	})
}

export default {
	source: Source.NearNeps_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Near || entityId.category !== ProposalCategory.Nep) {
					throw new Error('NearNeps_Github: proposal resolver only supports NEAR NEPs')
				}
				const { getMarkdownText } = await import('$/sources/NearNeps/Github/queries.ts')
				const text = await singleFlight(getMarkdownText)({ number: entityId.number })
				const frontmatter = parseFrontmatter(text)
				const body = stripFrontmatter(text)
				return {
					documentCategory: frontmatter.category?.trim() ?? 'NEP',
					documentTitle: frontmatter.title?.trim() ?? body.match(/^#\s*(.+)$/m)?.[1]?.trim(),
					documentStatus: frontmatter.status?.trim() ?? null,
					documentBody: body,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposals',
			resolve: async () => {
				const { getContents } = await import('$/sources/NearNeps/Github/queries.ts')
				return nearNepRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Near) throw new Error('NearNeps_Github: $$proposals only supports NEAR')
				const { getContents } = await import('$/sources/NearNeps/Github/queries.ts')
				return nearNepRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Near || entityId.category !== ProposalCategory.Nep) throw new Error('NearNeps_Github: $$proposals only supports NEAR NEPs')
				const { getContents } = await import('$/sources/NearNeps/Github/queries.ts')
				return nearNepRows(await getContents())
			},
		}),
	],
}
