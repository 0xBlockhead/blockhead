import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.BitcoinCash,
							category: ProposalCategory.Chip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						if (realm !== SpecificationRealm.BitcoinCash || category !== ProposalCategory.Chip)
							throw new Error('BitcoinCashChips_Gitlab: proposal resolver only supports Bitcoin Cash CHIPs')

						const {
							getChipMarkdownText,
							getTree,
						} = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
						const chip = chipRowsByNumber(await getTree())[number]
						const text = await getChipMarkdownText(
							{ path: chip.path }
						)
						if (text.trim() === '')
							throw new Error('BitcoinCashChips_Gitlab: empty proposal text')

						return {
							documentCategory: chipMetadataValue(text, 'Type'),
							documentTitle: chipMetadataValue(text, 'Title') ?? /^#\s+(.+)$/m.exec(text)?.[1]?.trim(),
							documentStatus: chipMetadataValue(text, 'Status'),
							documentBody: text,
						}
					},
				},
			},
		})({
				documentCategory: (snapshot) => snapshot.documentCategory,
				documentTitle: (snapshot) => snapshot.documentTitle,
				documentStatus: (snapshot) => snapshot.documentStatus,
				documentBody: (snapshot) => snapshot.documentBody,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
						return Object.values(chipRowsByNumber(await getTree()))
							.map(({ path: _path, ...chip }) => chip)
					},
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
} satisfies RegisteredSourceResolverModule<Source.BitcoinCashChips_Gitlab>
