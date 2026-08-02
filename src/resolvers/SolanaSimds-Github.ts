import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.SolanaSimds_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Solana,
				category: ProposalCategory.Simd,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getProposalMarkdownText } = await import('$/sources/SolanaSimds/Github/queries.ts')
			const text = await getProposalMarkdownText({ number })
			const body = stripFrontmatter(text)
			const frontmatter = parseFrontmatter(text)
			return {
				documentBody: body.length > 0 ? body : undefined,
				documentCategory: frontmatter.category?.trim() || 'SIMD',
				documentStatus: frontmatter.status?.trim() || undefined,
				documentTitle: (
					frontmatter.title?.trim()
					|| body.match(/^#\s*(.+)$/m)?.[1]?.trim()
				),
			}
		},
		resolveProposalIndex: async () => {
			const { getProposalContents } = await import('$/sources/SolanaSimds/Github/queries.ts')
			const proposals = (await getProposalContents()).flatMap((githubContent) => {
				const proposalNumber = regex('^(?<proposalNumber>\\d{4})-.+\\.md$').exec(githubContent.name)?.groups.proposalNumber
				return githubContent.type !== 'file' || proposalNumber == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Solana,
							category: ProposalCategory.Simd,
							number: parseInt(proposalNumber, 10),
						},
					}]
			}).toSorted((left, right) => (
				left[EntityMetaKey.Selector].number - right[EntityMetaKey.Selector].number
			))
			for (const [number, proposalsForNumber] of Map.groupBy(
				proposals,
				(proposal) => proposal[EntityMetaKey.Selector].number
			))
				if (proposalsForNumber.length > 1)
					throw new Error(`SolanaSimds_Github: proposal ${number} has duplicate files`)

			return proposals
		},
	}),
} satisfies RegisteredSourceResolverModule
