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
	source: Source.PolkadotRfcs_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Polkadot,
				category: ProposalCategory.Rfc,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getMarkdownText } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
			const text = await getMarkdownText({
				number,
			})
			if (text.trim() === '')
				throw new Error('PolkadotRfcs_Github: empty proposal markdown')

			return {
				documentCategory: 'RFC',
				documentTitle: text.match(/^#\s*(.+)$/m)?.[1]?.trim() || undefined,
				documentStatus: text.match(/^Status:\s*(.+)$/im)?.[1]?.trim() || undefined,
				documentBody: text,
			}
		},
		resolveProposalIndex: async () => {
			const { getContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
			return (await getContents()).flatMap((githubContent) => {
				const proposalNumberRaw = regex('^(?<proposalNumber>\\d{4})\\.md$').exec(githubContent.name)?.groups.proposalNumber
				return githubContent.type !== 'file' || proposalNumberRaw == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Polkadot,
							category: ProposalCategory.Rfc,
							number: parseInt(proposalNumberRaw, 10),
						},
					}]
			})
		},
	}),
} satisfies RegisteredSourceResolverModule
