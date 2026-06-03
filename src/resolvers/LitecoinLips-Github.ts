import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const metadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

const litecoinLipRows = async (entries: { type: string, name: string }[]) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^lip-(?<proposalNumber>\\d{4})\\.mediawiki$').exec(githubContent.name)?.groups.proposalNumber
		return githubContent.type !== 'file' || proposalNumberRaw == null ?
			[]
		:
			[{
				[EntityMetaKey.Id]: {
					realm: SpecificationRealm.Litecoin,
					category: ProposalCategory.Lip,
					number: parseInt(proposalNumberRaw, 10),
				},
			}]
	})
}

export default {
	source: Source.LitecoinLips_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Litecoin || entityId.category !== ProposalCategory.Lip) {
					throw new Error('LitecoinLips_Github: proposal resolver only supports Litecoin LIPs')
				}
				const { getMediaWikiText } = await import('$/sources/LitecoinLips/Github/queries.ts')
				const text = await singleFlight(getMediaWikiText)({ number: entityId.number })
				return {
					documentCategory: metadataValue(text, 'Type') ?? 'LIP',
					documentTitle: metadataValue(text, 'Title'),
					documentStatus: metadataValue(text, 'Status'),
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
				const { getContents } = await import('$/sources/LitecoinLips/Github/queries.ts')
				return litecoinLipRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Litecoin) throw new Error('LitecoinLips_Github: $$proposals only supports Litecoin')
				const { getContents } = await import('$/sources/LitecoinLips/Github/queries.ts')
				return litecoinLipRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Litecoin || entityId.category !== ProposalCategory.Lip) throw new Error('LitecoinLips_Github: $$proposals only supports Litecoin LIPs')
				const { getContents } = await import('$/sources/LitecoinLips/Github/queries.ts')
				return litecoinLipRows(await getContents())
			},
		}),
	],
}
