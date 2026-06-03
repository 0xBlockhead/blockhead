import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const bipMetadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

const githubBipProposalIndexRows = async (
	data: {
		type: string
		name: string
	}[],
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
						[EntityMetaKey.Id]: {
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const { getProposalMediaWikiText } = await import('$/sources/BitcoinBips/Github/queries.ts')
				if (entityId.realm !== SpecificationRealm.Bitcoin || entityId.category !== ProposalCategory.Bip) {
					throw new Error('BitcoinBips_Github: proposal resolver only supports Bitcoin BIPs')
				}
				const text = await singleFlight(getProposalMediaWikiText)({ number: entityId.number })
				if (text.trim() === '') throw new Error('BitcoinBips_Github: empty proposal text')
				return {
					documentCategory: bipMetadataValue(text, 'Type'),
					documentTitle: bipMetadataValue(text, 'Title'),
					documentStatus: bipMetadataValue(text, 'Status'),
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
				const { getContents } = await import('$/sources/BitcoinBips/Github/queries.ts')
				return githubBipProposalIndexRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Bitcoin) {
					throw new Error('BitcoinBips_Github: $$proposals only supports SpecificationRealm.Bitcoin')
				}
				const { getContents } = await import('$/sources/BitcoinBips/Github/queries.ts')
				return githubBipProposalIndexRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Bitcoin || entityId.category !== ProposalCategory.Bip) {
					throw new Error('BitcoinBips_Github: $$proposals only supports Bitcoin BIP proposal kind')
				}
				const { getContents } = await import('$/sources/BitcoinBips/Github/queries.ts')
				return githubBipProposalIndexRows(await getContents())
			},
		}),
	],
}
