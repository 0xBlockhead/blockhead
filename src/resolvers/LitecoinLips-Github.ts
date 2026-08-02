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
const metadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

export default {
	source: Source.LitecoinLips_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Litecoin,
							category: ProposalCategory.Lip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						if (realm !== SpecificationRealm.Litecoin || category !== ProposalCategory.Lip)
							throw new Error('LitecoinLips_Github: proposal resolver only supports Litecoin LIPs')

						const { getMediaWikiText } = await import('$/sources/LitecoinLips/Github/queries.ts')
						const text = await getMediaWikiText({
							number,
						})
						return {
							documentCategory: metadataValue(text, 'Type') ?? 'LIP',
							documentTitle: metadataValue(text, 'Title'),
							documentStatus: metadataValue(text, 'Status'),
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
						const { getContents } = await import('$/sources/LitecoinLips/Github/queries.ts')
						return (await getContents()).flatMap((githubContent) => {
							const proposalNumberRaw = regex('^lip-(?<proposalNumber>\\d{4})\\.mediawiki$').exec(githubContent.name)?.groups.proposalNumber
							return githubContent.type !== 'file' || proposalNumberRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										realm: SpecificationRealm.Litecoin,
										category: ProposalCategory.Lip,
										number: parseInt(proposalNumberRaw, 10),
									},
								}]
						})
					},
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
} satisfies RegisteredSourceResolverModule
