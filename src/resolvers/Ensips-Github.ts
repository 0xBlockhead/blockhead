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
	source: Source.Ensips_Github,

	resolvers: [
		defineResolver(Source.Ensips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Ens,
							category: ProposalCategory.Ensip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						const {
							getProposalMarkdownText,
						} = await import('$/sources/Ensips/Github/queries.ts')

						if (realm !== SpecificationRealm.Ens || category !== ProposalCategory.Ensip) {
							throw new Error('Ensips_Github: proposal resolver only supports ENSIPs')
						}
						const text = await getProposalMarkdownText({
							number,
						})
						const body = stripFrontmatter(text)
						const fm = parseFrontmatter(text)
						return {
							documentCategory: fm.category.trim() || undefined,
							documentTitle: (
								fm.title.trim()
								|| body.match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1]?.trim()
								|| fm.description.trim()
							),
							documentStatus: fm.status.trim() || undefined,
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

		defineResolver(Source.Ensips_Github, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getContents } = await import('$/sources/Ensips/Github/queries.ts')
						return (await getContents()).flatMap((githubContent) => {
							const proposalNumberRaw = (
								githubContent.type === 'file' && githubContent.name.endsWith('.md') ?
									regex('^(?<proposalNumber>\\d+)\\.md$').exec(githubContent.name)?.groups.proposalNumber
								:
									undefined
							)
							return proposalNumberRaw == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: {
										realm: SpecificationRealm.Ens,
										category: ProposalCategory.Ensip,
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
}
