import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { SpecificationProposalSelector } from '$/schema/SpecificationProposal.ts'
import { SpecificationRealmSelector } from '$/schema/SpecificationRealm.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'

const bipMetadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

const githubBipProposalIndexRows = async (
	data: {
		type: string
		name: string
	}[]
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return data
		.flatMap((githubContent) => {
			const proposalNumberRaw = (
				githubContent.type === 'file' ?
					regex('^bip-(?<proposalNumber>\\d{4})\\.mediawiki$').exec(githubContent.name)?.groups.proposalNumber
				:
					null
			)
			return proposalNumberRaw == null ?
				[]
			:
				[
					{
						[EntityMetaKey.Selector]: {
							realm: SpecificationRealm.Bitcoin,
							category: ProposalCategory.Bip,
							number: parseInt(proposalNumberRaw, 10),
						},
					},
				]
		})
}

export default {
	source: Source.BitcoinBips_Github,

	resolvers: [
		defineResolver(Source.BitcoinBips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const { getProposalMediaWikiText } = await import('$/sources/BitcoinBips/Github/queries.ts')
				if (realm !== SpecificationRealm.Bitcoin || category !== ProposalCategory.Bip) {
					throw new Error('BitcoinBips_Github: proposal resolver only supports Bitcoin BIPs')
				}
				const text = await getProposalMediaWikiText({ number: number })
				if (text.trim() === '') throw new Error('BitcoinBips_Github: empty proposal text')
				return {
					documentCategory: bipMetadataValue(text, 'Type'),
					documentTitle: bipMetadataValue(text, 'Title'),
					documentStatus: bipMetadataValue(text, 'Status'),
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

		defineResolver(Source.BitcoinBips_Github, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
				const { getContents } = await import('$/sources/BitcoinBips/Github/queries.ts')
				return githubBipProposalIndexRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.BitcoinBips_Github, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Bitcoin) {
					throw new Error('BitcoinBips_Github: $$proposals only supports SpecificationRealm.Bitcoin')
				}
				const { getContents } = await import('$/sources/BitcoinBips/Github/queries.ts')
				return githubBipProposalIndexRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.BitcoinBips_Github, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Bitcoin || category !== ProposalCategory.Bip) {
					throw new Error('BitcoinBips_Github: $$proposals only supports Bitcoin BIP proposal kind')
				}
				const { getContents } = await import('$/sources/BitcoinBips/Github/queries.ts')
				return githubBipProposalIndexRows(await getContents())
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),
	],
}
