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

const metadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

export default {
	source: Source.LitecoinLips_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Litecoin,
				category: ProposalCategory.Lip,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getMediaWikiText } = await import('$/sources/LitecoinLips/Github/queries.ts')
			const text = await getMediaWikiText({
				number,
			})
			return {
				documentCategory: metadataValue(text, 'Type') ?? 'LIP',
				documentTitle: metadataValue(text, 'Title'),
				documentStatus: metadataValue(text, 'Status'),
				documentBody: text,
			}
		},
		resolveProposalIndex: async () => {
			const { getContents } = await import('$/sources/LitecoinLips/Github/queries.ts')
			return (await getContents()).flatMap((githubContent) => {
				const proposalNumberRaw = regex('^lip-(?<proposalNumber>\\d{4})\\.mediawiki$').exec(githubContent.name)?.groups.proposalNumber
				return githubContent.type !== 'file' || proposalNumberRaw == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Litecoin,
							category: ProposalCategory.Lip,
							number: parseInt(proposalNumberRaw, 10),
						},
					}]
			})
		},
	}),
} satisfies RegisteredSourceResolverModule
