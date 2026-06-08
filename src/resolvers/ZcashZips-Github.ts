import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const zipMetadataValue = (text: string, key: string) => (
	new RegExp(`^:${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
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
					regex('^zip-(?<proposalNumber>\\d{4})\\.rst$').exec(githubContent.name)?.groups.proposalNumber
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

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
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
			}
			},
			fields: {
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
				return githubZipProposalIndexRows(await getContents())
			}
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Zcash) {
					throw new Error('ZcashZips_Github: $$proposals only supports SpecificationRealm.Zcash')
				}
				const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
				return githubZipProposalIndexRows(await getContents())
			}
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Zcash || entityId.category !== ProposalCategory.Zip) {
					throw new Error('ZcashZips_Github: $$proposals only supports Zcash ZIP proposal kind')
				}
				const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
				return githubZipProposalIndexRows(await getContents())
			}
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),
	],
}
