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
	source: Source.Caips_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.ChainAgnostic,
				category: ProposalCategory.Caip,
			},
		],
		resolveProposal: async ({ number }) => {
			const {
				getMarkdownTextForNumber,
			} = await import('$/sources/Caips/Github/queries.ts')

			const text = await getMarkdownTextForNumber({
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
			const { getContents } = await import('$/sources/Caips/Github/queries.ts')
			return (await getContents())
				.flatMap((githubContent) => {
					const caipNumberRaw = (
						githubContent.type === 'file' && githubContent.name.endsWith('.md') ?
							regex('^caip-(?<caipNumber>\\d+)\\.md$').exec(githubContent.name)?.groups.caipNumber
						:
							undefined
					)
					return caipNumberRaw == null ?
						[]
					:
						[{
							[EntityMetaKey.Selector]: {
								realm: SpecificationRealm.ChainAgnostic,
								category: ProposalCategory.Caip,
								number: parseInt(caipNumberRaw, 10),
							},
						}]
				})
		},
	}),
} satisfies RegisteredSourceResolverModule
