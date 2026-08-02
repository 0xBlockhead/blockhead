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
	source: Source.Ensips_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Ens,
				category: ProposalCategory.Ensip,
			},
		],
		resolveProposal: async ({ number }) => {
			const {
				getProposalMarkdownText,
			} = await import('$/sources/Ensips/Github/queries.ts')

			const text = await getProposalMarkdownText({
				number,
			})
			const body = stripFrontmatter(text)
			const frontmatter = parseFrontmatter(text)
			return {
				documentCategory: frontmatter.category?.trim() || undefined,
				documentTitle: (
					frontmatter.title?.trim()
					|| body.match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1]?.trim()
					|| frontmatter.description?.trim()
				),
				documentStatus: frontmatter.status?.trim() || undefined,
				documentBody: body.length > 0 ? body : undefined,
			}
		},
		resolveProposalIndex: async () => {
			const { getContents } = await import('$/sources/Ensips/Github/queries.ts')
			return (await getContents()).flatMap((githubContent) => {
				const proposalNumberRaw = (
					githubContent.type === 'file' && githubContent.name.endsWith('.md') ?
						regex('^(?<proposalNumber>\\d+)\\.md$').exec(githubContent.name)?.groups.proposalNumber
					:
						undefined
				)
				return proposalNumberRaw == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Ens,
							category: ProposalCategory.Ensip,
							number: parseInt(proposalNumberRaw, 10),
						},
					}]
			})
		},
	}),
} satisfies RegisteredSourceResolverModule
