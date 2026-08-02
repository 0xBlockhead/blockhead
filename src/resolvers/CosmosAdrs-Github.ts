import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.CosmosAdrs_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Cosmos,
				category: ProposalCategory.Adr,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getMarkdownText } = await import('$/sources/CosmosAdrs/Github/queries.ts')
			const text = await getMarkdownText({
				number,
			})
			return {
				documentCategory: 'ADR',
				documentTitle: text.match(/^#\s*(.+)$/m)?.[1]?.trim(),
				documentStatus: (
					text.match(/^##\s*Status\s*\n+(.+)$/im)?.[1]?.trim()
					?? text.match(/^Status:\s*(.+)$/im)?.[1]?.trim()
				),
				documentBody: text,
			}
		},
		resolveProposalIndex: async () => {
			const { getContents } = await import('$/sources/CosmosAdrs/Github/queries.ts')
			return (await getContents()).flatMap((githubContent) => {
				const proposalNumberRaw = regex('^adr-(?<proposalNumber>\\d{3})\\.md$').exec(githubContent.name)?.groups.proposalNumber
				return githubContent.type !== 'file' || proposalNumberRaw == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Cosmos,
							category: ProposalCategory.Adr,
							number: parseInt(proposalNumberRaw, 10),
						},
					}]
			})
		},
	}),
} satisfies RegisteredSourceResolverModule
