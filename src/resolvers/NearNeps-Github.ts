import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import { regex } from 'arkregex'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.NearNeps_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Near,
				category: ProposalCategory.Nep,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getMarkdownText } = await import('$/sources/NearNeps/Github/queries.ts')
			const text = await getMarkdownText({
				number,
			})
			const frontmatter = parseFrontmatter(text)
			return {
				documentCategory: frontmatter.category?.trim(),
				documentTitle: frontmatter.title?.trim(),
				documentStatus: frontmatter.status?.trim(),
				documentBody: stripFrontmatter(text),
			}
		},
		resolveProposalIndex: async () => {
			const { getContents } = await import('$/sources/NearNeps/Github/queries.ts')
			return (await getContents()).flatMap((githubContent) => {
				const proposalNumberRaw = regex('^nep-(?<proposalNumber>\\d{4})\\.md$').exec(githubContent.name)?.groups.proposalNumber
				return githubContent.type !== 'file' || proposalNumberRaw == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Near,
							category: ProposalCategory.Nep,
							number: parseInt(proposalNumberRaw, 10),
						},
					}]
			})
		},
	}),
} satisfies RegisteredSourceResolverModule
