import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const dipMetadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
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

	resolvers: [
		defineResolver(Source.DogecoinDips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const { getMediaWikiText } = await import('$/sources/DogecoinDips/Github/queries.ts')
				if (entityId.realm !== SpecificationRealm.Dogecoin || entityId.category !== ProposalCategory.Dip) {
					throw new Error('DogecoinDips_Github: proposal resolver only supports Dogecoin DIPs')
				}
				const text = await singleFlight(getMediaWikiText)({ number: entityId.number })
				if (text.trim() === '') throw new Error('DogecoinDips_Github: empty proposal text')
				return {
					documentCategory: dipMetadataValue(text, 'Type'),
					documentTitle: dipMetadataValue(text, 'Title'),
					documentStatus: dipMetadataValue(text, 'Status'),
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

		defineResolver(Source.DogecoinDips_Github, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: dogecoinDipProposalRows
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.DogecoinDips_Github, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Dogecoin) {
					throw new Error('DogecoinDips_Github: $$proposals only supports Dogecoin')
				}
				return dogecoinDipProposalRows()
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.DogecoinDips_Github, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Dogecoin || entityId.category !== ProposalCategory.Dip) {
					throw new Error('DogecoinDips_Github: $$proposals only supports Dogecoin DIPs')
				}
				return dogecoinDipProposalRows()
			}
			}
		})({
				fields: {
			$$proposals: (snapshot) => snapshot,
		},
			}),
	],
}
