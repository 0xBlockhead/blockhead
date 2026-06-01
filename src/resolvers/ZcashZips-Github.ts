import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const zipMetadataValue = (text: string, key: string) => (
	new RegExp(`^:${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim() ?? null
)

const githubZipProposalIndexRows = async (
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
					regex('^zip-(?<proposalNumber>\\d{4})\\.rst$').exec(githubContent.name)?.groups?.proposalNumber
				:
					null
			)
			return proposalNumberRaw == null ?
				[]
			:
				[
					{
						[EntityMetaKey.Id]: {
							realm: SpecificationRealm.Zcash,
							category: ProposalCategory.Zip,
							number: parseInt(proposalNumberRaw, 10),
						},
					},
				]
		})
}

export default {
	source: Source.ZcashZips_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const { getProposalRstText } = await import('$/sources/ZcashZips/Github/queries.ts')
				if (entityId.realm !== SpecificationRealm.Zcash || entityId.category !== ProposalCategory.Zip) {
					throw new Error('ZcashZips_Github: proposal resolver only supports Zcash ZIPs')
				}
				const text = await singleFlight(getProposalRstText)({ number: entityId.number })
				if (text.trim() === '') throw new Error('ZcashZips_Github: empty proposal text')
				return {
					documentCategory: zipMetadataValue(text, 'Category'),
					documentTitle: zipMetadataValue(text, 'Title'),
					documentStatus: zipMetadataValue(text, 'Status'),
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
				const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
				return githubZipProposalIndexRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Zcash) {
					throw new Error('ZcashZips_Github: $$proposals only supports SpecificationRealm.Zcash')
				}
				const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
				return githubZipProposalIndexRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Zcash || entityId.category !== ProposalCategory.Zip) {
					throw new Error('ZcashZips_Github: $$proposals only supports Zcash ZIP proposal kind')
				}
				const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
				return githubZipProposalIndexRows(await getContents())
			},
		}),
	],
}
