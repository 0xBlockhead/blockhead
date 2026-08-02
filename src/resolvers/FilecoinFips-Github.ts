import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.FilecoinFips_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Filecoin,
				category: ProposalCategory.Fip,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getMarkdownText } = await import('$/sources/FilecoinFips/Github/queries.ts')
			const text = await getMarkdownText({
				number,
			})
			const body = stripFrontmatter(text)
			const frontmatter = parseFrontmatter(text)
			return {
				documentCategory: frontmatter.type?.trim() || undefined,
				documentTitle: frontmatter.title?.trim() || undefined,
				documentStatus: frontmatter.status?.trim() || undefined,
				documentBody: body.length > 0 ? body : undefined,
			}
		},
		resolveProposalIndex: async () => {
			const { getContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
			return (await getContents()).flatMap((githubContent) => {
				const proposalNumberRaw = regex('^fip-(?<proposalNumber>\\d+)\\.md$').exec(githubContent.name)?.groups.proposalNumber
				return githubContent.type !== 'file' || proposalNumberRaw == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Filecoin,
							category: ProposalCategory.Fip,
							number: parseInt(proposalNumberRaw, 10),
						},
					}]
			})
		},
	}),
} satisfies RegisteredSourceResolverModule
