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
export default {
	source: Source.CosmosAdrs_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Cosmos,
							category: ProposalCategory.Adr,
						},
					],
					resolve: async ({ category, number, realm }) => {
						if (realm !== SpecificationRealm.Cosmos || category !== ProposalCategory.Adr) {
							throw new Error('CosmosAdrs_Github: proposal resolver only supports Cosmos SDK ADRs')
						}
						const { getMarkdownText } = await import('$/sources/CosmosAdrs/Github/queries.ts')
						const text = await getMarkdownText({
							number,
						})
						return {
							documentCategory: 'ADR',
							documentTitle: text.match(/^#\s*(.+)$/m)?.[1]?.trim(),
							documentStatus: (
								text.match(/^##\s*Status\s*\n+(.+)$/im)?.[1]?.trim()
								?? text.match(/^Status:\s*(.+)$/im)?.[1]?.trim()
							),
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
						const { getContents } = await import('$/sources/CosmosAdrs/Github/queries.ts')
						return (await getContents()).flatMap((githubContent) => {
							const proposalNumberRaw = regex('^adr-(?<proposalNumber>\\d{3})\\.md$').exec(githubContent.name)?.groups.proposalNumber
							return githubContent.type !== 'file' || proposalNumberRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										realm: SpecificationRealm.Cosmos,
										category: ProposalCategory.Adr,
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
} satisfies RegisteredSourceResolverModule<Source.CosmosAdrs_Github>
