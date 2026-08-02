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
	source: Source.PolkadotRfcs_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Polkadot,
							category: ProposalCategory.Rfc,
						},
					],
					resolve: async ({ category, number, realm }) => {
						if (realm !== SpecificationRealm.Polkadot || category !== ProposalCategory.Rfc)
							throw new Error('PolkadotRfcs_Github: proposal resolver only supports Polkadot Fellowship RFCs')

						const { getMarkdownText } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
						const text = await getMarkdownText({
							number,
						})
						return {
							documentCategory: 'RFC',
							documentTitle: text.match(/^#\s*(.+)$/m)?.[1]?.trim(),
							documentStatus: text.match(/^Status:\s*(.+)$/im)?.[1]?.trim(),
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
						const { getContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
						return (await getContents()).flatMap((githubContent) => {
							const proposalNumberRaw = regex('^(?<proposalNumber>\\d{4})\\.md$').exec(githubContent.name)?.groups.proposalNumber
							return githubContent.type !== 'file' || proposalNumberRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										realm: SpecificationRealm.Polkadot,
										category: ProposalCategory.Rfc,
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
} satisfies RegisteredSourceResolverModule<Source.PolkadotRfcs_Github>
