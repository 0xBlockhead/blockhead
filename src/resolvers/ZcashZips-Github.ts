import {
	ProposalCategory as OwnedProposalCategory,
	SpecificationRealm as OwnedSpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
const zipMetadataValue = (text: string, key: string) => (
	new RegExp(`^:${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

const githubZipProposalIndexRows = async (
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
					regex('^zip-(?<proposalNumber>\\d{4})\\.rst$').exec(githubContent.name)?.groups.proposalNumber
				:
					null
			)
			return proposalNumberRaw == null ?
				[]
			:
				[
					{
						[EntityMetaKey.Selector]: {
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
		defineResolver(Source.ZcashZips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: OwnedSpecificationRealm.Zcash,
							category: OwnedProposalCategory.Zip,
						},
					],
					resolve: async ({ category, number, realm }) => {
					const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
					const { getProposalRstText } = await import('$/sources/ZcashZips/Github/queries.ts')
					if (realm !== SpecificationRealm.Zcash || category !== ProposalCategory.Zip) {
						throw new Error('ZcashZips_Github: proposal resolver only supports Zcash ZIPs')
					}
					const text = await getProposalRstText({
						number: number,
					})
					if (text.trim() === '') throw new Error('ZcashZips_Github: empty proposal text')
					return {
						documentCategory: zipMetadataValue(text, 'Category'),
						documentTitle: zipMetadataValue(text, 'Title'),
						documentStatus: zipMetadataValue(text, 'Status'),
						documentBody: text,
					}
				},
				}
			}
		})({
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}),

		defineResolver(Source.ZcashZips_Github, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
						return githubZipProposalIndexRows(await getContents())
					},
				}
			}
		})({
			$$proposals: (snapshot) => snapshot,
		}),
	],
}
