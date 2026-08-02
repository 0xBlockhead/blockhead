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

const dipMetadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

export default {
	source: Source.DogecoinDips_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Dogecoin,
				category: ProposalCategory.Dip,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getMediaWikiText } = await import('$/sources/DogecoinDips/Github/queries.ts')
			const text = await getMediaWikiText({
				number,
			})
			if (text.trim() === '')
				throw new Error('DogecoinDips_Github: empty proposal text')

			return {
				documentCategory: dipMetadataValue(text, 'Type'),
				documentTitle: dipMetadataValue(text, 'Title'),
				documentStatus: dipMetadataValue(text, 'Status'),
				documentBody: text,
			}
		},
		resolveProposalIndex: async () => {
			const { getContents } = await import('$/sources/DogecoinDips/Github/queries.ts')
			return (await getContents()).flatMap((githubContent) => {
				const proposalNumberRaw = regex('^dip-(?<proposalNumber>\\d{4})\\.mediawiki$').exec(githubContent.name)?.groups.proposalNumber
				return githubContent.type !== 'file' || proposalNumberRaw == null ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Dogecoin,
							category: ProposalCategory.Dip,
							number: parseInt(proposalNumberRaw, 10),
						},
					}]
			})
		},
	}),
} satisfies RegisteredSourceResolverModule
