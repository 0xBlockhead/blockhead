import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { BitcoinCashChipsGitlabTree } from '$/sources/BitcoinCashChips/Gitlab/types.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { SpecificationProposalSelector } from '$/schema/SpecificationProposal.ts'
import { SpecificationRealmSelector } from '$/schema/SpecificationRealm.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'

const chipMetadataValue = (text: string, key: string) => (
	new RegExp(`^>\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

const chipRowsByNumber = async (tree: BitcoinCashChipsGitlabTree) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
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

const chipProposalIndexRows = async (tree: BitcoinCashChipsGitlabTree) => (
	Object.values(await chipRowsByNumber(tree)).map(({ path: _path, ...chip }) => chip)
)

export default {
	source: Source.BitcoinCashChips_Gitlab,

	resolvers: [
		defineResolver(Source.BitcoinCashChips_Gitlab, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.BitcoinCash || category !== ProposalCategory.Chip) {
					throw new Error('BitcoinCashChips_Gitlab: proposal resolver only supports Bitcoin Cash CHIPs')
				}
				const {
					getChipMarkdownText,
					getTree,
				} = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
				const chip = (await chipRowsByNumber(await getTree()))[number]
				const text = await getChipMarkdownText({ path: chip.path })
				if (text.trim() === '') throw new Error('BitcoinCashChips_Gitlab: empty proposal text')
				return {
					documentCategory: chipMetadataValue(text, 'Type'),
					documentTitle: chipMetadataValue(text, 'Title') ?? /^#\s+(.+)$/m.exec(text)?.[1]?.trim(),
					documentStatus: chipMetadataValue(text, 'Status'),
					documentBody: text,
				}
			}
			}
		})({
				fields: {
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		},
			}),

		defineResolver(Source.BitcoinCashChips_Gitlab, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
				const { getTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
				return chipProposalIndexRows(await getTree())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.BitcoinCashChips_Gitlab, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.BitcoinCash) {
					throw new Error('BitcoinCashChips_Gitlab: $$proposals only supports Bitcoin Cash')
				}
				const { getTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
				return chipProposalIndexRows(await getTree())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.BitcoinCashChips_Gitlab, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.BitcoinCash || category !== ProposalCategory.Chip) {
					throw new Error('BitcoinCashChips_Gitlab: $$proposals only supports Bitcoin Cash CHIPs')
				}
				const { getTree } = await import('$/sources/BitcoinCashChips/Gitlab/queries.ts')
				return chipProposalIndexRows(await getTree())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),
	],
}
