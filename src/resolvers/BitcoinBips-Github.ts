import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import type { RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import bindings from '$/sources/BitcoinBips/bindings.ts'
import { Source } from '$/sources/Source.ts'

const bitcoinBipsBinding = bindings[Source.BitcoinBips_Github][0]

const bipMetadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

export default {
	source: Source.BitcoinBips_Github,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.Bitcoin,
				category: ProposalCategory.Bip,
			},
		],
		resolveProposal: async ({ number }) => {
			const { getProposalText } = await import('$/sources/BitcoinBips/Github/queries.ts')
			const text = await getProposalText({
				number,
			})
			if (text.trim() === '')
				throw new Error('BitcoinBips_Github: empty proposal text')

			return {
				documentBody: text,
				documentCategory: bipMetadataValue(text, 'Type'),
				documentStatus: bipMetadataValue(text, 'Status'),
				documentTitle: bipMetadataValue(text, 'Title'),
			}
		},
		resolveProposalIndex: async () => {
			const { getProposalFiles } = await import('$/sources/BitcoinBips/Github/queries.ts')
			return (await getProposalFiles(bitcoinBipsBinding)).map(({ number }) => ({
				[EntityMetaKey.Selector]: {
					realm: SpecificationRealm.Bitcoin,
					category: ProposalCategory.Bip,
					number,
				},
			}))
		},
	}),
} satisfies RegisteredSourceResolverModule
