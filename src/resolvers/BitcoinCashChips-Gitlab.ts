import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import defineSpecificationProposalResolvers from '$/resolvers/SpecificationProposal.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'
import type { BitcoinCashChipsGitlabTree } from '$/sources/BitcoinCashChips/Gitlab/types.ts'
const chipMetadataValue = (text: string, key: string) => (
	new RegExp(`^>\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

const chipRowsByNumber = (tree: BitcoinCashChipsGitlabTree) => {
	return Object.fromEntries(
		tree
			.filter((gitlabTreeEntry) => gitlabTreeEntry.type === 'blob' && gitlabTreeEntry.name.endsWith('.md') && gitlabTreeEntry.name.startsWith('CHIP-'))
			.sort((firstEntry, secondEntry) => firstEntry.name.localeCompare(secondEntry.name))
			.map((gitlabTreeEntry, index) => {
				const dateParts = regex('^CHIP-(?<year>\\d{4})-(?<month>\\d{2})-').exec(gitlabTreeEntry.name)?.groups
				const number = (
					dateParts == null ?
						index + 1
					:
						(
							parseInt(dateParts.year, 10) * 100_000
							+ parseInt(dateParts.month, 10) * 1_000
							+ index + 1
						)
				)
				return [
					number,
					{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.BitcoinCash,
							category: ProposalCategory.Chip,
							number,
						},
						path: gitlabTreeEntry.path,
					},
				]
			})
	)
}

export default {
	source: Source.BitcoinCashChips_Gitlab,

	resolvers: defineSpecificationProposalResolvers({
		appliesTo: [
			{
				realm: SpecificationRealm.BitcoinCash,
				category: ProposalCategory.Chip,
			},
		],
		resolveProposal: async ({ number }) => {
			const {
				getChipMarkdownText,
				getTree,
			} = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
			const chip = chipRowsByNumber(await getTree())[number]
			const text = await getChipMarkdownText({
				path: chip.path,
			})
			if (text.trim() === '')
				throw new Error('BitcoinCashChips_Gitlab: empty proposal text')

			return {
				documentBody: text,
				documentCategory: chipMetadataValue(text, 'Type'),
				documentStatus: chipMetadataValue(text, 'Status'),
				documentTitle: chipMetadataValue(text, 'Title') ?? /^#\s+(.+)$/m.exec(text)?.[1]?.trim(),
			}
		},
		resolveProposalIndex: async () => {
			const { getTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
			return Object.values(chipRowsByNumber(await getTree()))
				.map(({ path: _path, ...chip }) => chip)
		},
	}),
} satisfies RegisteredSourceResolverModule
