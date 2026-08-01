import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
export default {
	source: Source.Caips_Github,

	resolvers: [
		defineResolver(Source.Caips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.ChainAgnostic,
							category: ProposalCategory.Caip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						const {
							getMarkdownTextForNumber,
						} = await import('$/sources/Caips/Github/queries.ts')

						if (
							category !== ProposalCategory.Caip
							|| realm !== SpecificationRealm.ChainAgnostic
						) throw new Error('Caips_Github: unsupported proposal id')
						const text = await getMarkdownTextForNumber({
							number,
						})
						const body = stripFrontmatter(text)
						const frontmatter = parseFrontmatter(text)
						return {
							documentCategory: frontmatter.type.trim() || undefined,
							documentTitle: frontmatter.title.trim() || undefined,
							documentStatus: frontmatter.status.trim() || undefined,
							documentBody: body.length > 0 ? body : undefined,
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

		defineResolver(Source.Caips_Github, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getContents } = await import('$/sources/Caips/Github/queries.ts')
						return (await getContents())
							.flatMap((githubContent) => {
								const caipNumberRaw = (
									githubContent.type === 'file' && githubContent.name.endsWith('.md') ?
										regex('^caip-(?<caipNumber>\\d+)\\.md$').exec(githubContent.name)?.groups.caipNumber
									:
										undefined
								)
								return caipNumberRaw == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											realm: SpecificationRealm.ChainAgnostic,
											category: ProposalCategory.Caip,
											number: parseInt(caipNumberRaw, 10),
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
}
