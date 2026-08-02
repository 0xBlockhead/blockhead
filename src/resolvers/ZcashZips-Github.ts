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

const zipMetadataValue = (text: string, key: string) => (
	new RegExp(`^:${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

export default {
	source: Source.ZcashZips_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Zcash,
				category: ProposalCategory.Zip,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getProposalRstText } = await import('$/sources/ZcashZips/Github/queries.ts')
			const text = await getProposalRstText({
				number,
			})
			if (text.trim() === '')
				throw new Error('ZcashZips_Github: empty proposal text')

			return {
				documentCategory: zipMetadataValue(text, 'Category'),
				documentTitle: zipMetadataValue(text, 'Title'),
				documentStatus: zipMetadataValue(text, 'Status'),
				documentBody: text,
			}
		},
		resolveProposalIndex: async () => {
			const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
			return (await getContents())
				.flatMap((githubContent) => {
					const proposalNumberRaw = (
						githubContent.type === 'file' ?
							regex('^zip-(?<proposalNumber>\\d{4})\\.rst$').exec(githubContent.name)?.groups.proposalNumber
						:
							null
					)
					return proposalNumberRaw == null ?
						[]
					:
						[
							{
								[EntityMetaKey.Selector]: {
									realm: SpecificationRealm.Zcash,
									category: ProposalCategory.Zip,
									number: parseInt(proposalNumberRaw, 10),
								},
							},
						]
				})
		},
	}),
} satisfies RegisteredSourceResolverModule
