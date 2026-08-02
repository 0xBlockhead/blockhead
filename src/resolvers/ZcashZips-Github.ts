import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
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

export default {
	source: Source.ZcashZips_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Zcash,
							category: ProposalCategory.Zip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						const { getProposalRstText } = await import('$/sources/ZcashZips/Github/queries.ts')
						if (realm !== SpecificationRealm.Zcash || category !== ProposalCategory.Zip)
							throw new Error('ZcashZips_Github: proposal resolver only supports Zcash ZIPs')

						const text = await getProposalRstText({
							number,
						})
						if (text.trim() === '')
							throw new Error('ZcashZips_Github: empty proposal text')

						return {
							documentCategory: zipMetadataValue(text, 'Category'),
							documentTitle: zipMetadataValue(text, 'Title'),
							documentStatus: zipMetadataValue(text, 'Status'),
							documentBody: text,
						}
					},
				},
			},
		})({
				documentCategory: (snapshot) => snapshot.documentCategory,
				documentTitle: (snapshot) => snapshot.documentTitle,
				documentStatus: (snapshot) => snapshot.documentStatus,
				documentBody: (snapshot) => snapshot.documentBody,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getContents } = await import('$/sources/ZcashZips/Github/queries.ts')
						return (await getContents())
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
					},
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
} satisfies RegisteredSourceResolverModule<Source.ZcashZips_Github>
