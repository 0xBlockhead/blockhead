import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const dipMetadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim() ?? null
)

const dogecoinDipProposalRows = async () => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return [70, 71, 72].map((number) => ({
		[EntityMetaKey.Id]: {
			realm: SpecificationRealm.Dogecoin,
			category: ProposalCategory.Dip,
			number,
		},
	}))
}

export default {
	source: Source.DogecoinDips_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const { getDogecoinDipMediaWikiText } = await import('$/sources/DogecoinDips/Github/queries.ts')
				if (entityId.realm !== SpecificationRealm.Dogecoin || entityId.category !== ProposalCategory.Dip) {
					throw new Error('DogecoinDips_Github: proposal resolver only supports Dogecoin DIPs')
				}
				const text = await singleFlight(getDogecoinDipMediaWikiText)({ number: entityId.number })
				if (text.trim() === '') throw new Error('DogecoinDips_Github: empty proposal text')
				return {
					documentCategory: dipMetadataValue(text, 'Type'),
					documentTitle: dipMetadataValue(text, 'Title'),
					documentStatus: dipMetadataValue(text, 'Status'),
					documentBody: text,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposals',
			resolve: dogecoinDipProposalRows,
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Dogecoin) {
					throw new Error('DogecoinDips_Github: $$proposals only supports Dogecoin')
				}
				return dogecoinDipProposalRows()
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Dogecoin || entityId.category !== ProposalCategory.Dip) {
					throw new Error('DogecoinDips_Github: $$proposals only supports Dogecoin DIPs')
				}
				return dogecoinDipProposalRows()
			},
		}),
	],
}
