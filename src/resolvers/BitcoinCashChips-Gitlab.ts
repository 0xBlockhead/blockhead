import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { BitcoinCashChipsGitlabTree } from '$/sources/BitcoinCashChips/Gitlab/types.ts'

const chipMetadataValue = (text: string, key: string) => (
	new RegExp(`^>\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim() ?? null
)

const chipRowsByNumber = async (tree: BitcoinCashChipsGitlabTree) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return Object.fromEntries(
		tree
			.filter((entry) => entry.type === 'blob' && entry.name.endsWith('.md') && entry.name.startsWith('CHIP-'))
			.sort((firstEntry, secondEntry) => firstEntry.name.localeCompare(secondEntry.name))
			.map((entry, index) => {
				const dateParts = regex('^CHIP-(?<year>\\d{4})-(?<month>\\d{2})-').exec(entry.name)?.groups
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
						[EntityMetaKey.Id]: {
							realm: SpecificationRealm.BitcoinCash,
							category: ProposalCategory.Chip,
							number,
						},
						path: entry.path,
					},
				]
			}),
	)
}

const chipProposalIndexRows = async (tree: BitcoinCashChipsGitlabTree) => (
	Object.values(await chipRowsByNumber(tree)).map(({ path: _path, ...row }) => row)
)

export default {
	source: Source.BitcoinCashChips_Gitlab,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.BitcoinCash || entityId.category !== ProposalCategory.Chip) {
					throw new Error('BitcoinCashChips_Gitlab: proposal resolver only supports Bitcoin Cash CHIPs')
				}
				const {
					getBitcoinCashChipMarkdownText,
					getBitcoinCashChipsGitlabTree,
				} = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
				const row = (await chipRowsByNumber(await singleFlight(getBitcoinCashChipsGitlabTree)()))[entityId.number]
				if (row == null) throw new Error(`BitcoinCashChips_Gitlab: CHIP not found ${String(entityId.number)}`)
				const text = await singleFlight(getBitcoinCashChipMarkdownText)({ path: row.path })
				if (text.trim() === '') throw new Error('BitcoinCashChips_Gitlab: empty proposal text')
				return {
					documentCategory: chipMetadataValue(text, 'Type'),
					documentTitle: chipMetadataValue(text, 'Title') ?? /^#\s+(.+)$/m.exec(text)?.[1]?.trim() ?? null,
					documentStatus: chipMetadataValue(text, 'Status'),
					documentBody: text,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposals',
			resolve: async () => {
				const { getBitcoinCashChipsGitlabTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
				return chipProposalIndexRows(await singleFlight(getBitcoinCashChipsGitlabTree)())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.BitcoinCash) {
					throw new Error('BitcoinCashChips_Gitlab: $$proposals only supports Bitcoin Cash')
				}
				const { getBitcoinCashChipsGitlabTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
				return chipProposalIndexRows(await singleFlight(getBitcoinCashChipsGitlabTree)())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.BitcoinCash || entityId.category !== ProposalCategory.Chip) {
					throw new Error('BitcoinCashChips_Gitlab: $$proposals only supports Bitcoin Cash CHIPs')
				}
				const { getBitcoinCashChipsGitlabTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
				return chipProposalIndexRows(await singleFlight(getBitcoinCashChipsGitlabTree)())
			},
		}),
	],
}
