import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
export default {
	source: Source.NearNeps_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Near,
							category: ProposalCategory.Nep,
						},
					],
					resolve: async ({ category, number, realm }) => {
						if (realm !== SpecificationRealm.Near || category !== ProposalCategory.Nep)
							throw new Error('NearNeps_Github: proposal resolver only supports NEAR NEPs')

						const { getMarkdownText } = await import('$/sources/NearNeps/Github/queries.ts')
						const text = await getMarkdownText({
							number,
						})
						const frontmatter = parseFrontmatter(text)
						return {
							documentCategory: frontmatter.category.trim(),
							documentTitle: frontmatter.title.trim(),
							documentStatus: frontmatter.status.trim(),
							documentBody: stripFrontmatter(text),
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
						const { getContents } = await import('$/sources/NearNeps/Github/queries.ts')
						return (await getContents()).flatMap((githubContent) => {
							const proposalNumberRaw = regex('^nep-(?<proposalNumber>\\d{4})\\.md$').exec(githubContent.name)?.groups.proposalNumber
							return githubContent.type !== 'file' || proposalNumberRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										realm: SpecificationRealm.Near,
										category: ProposalCategory.Nep,
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
