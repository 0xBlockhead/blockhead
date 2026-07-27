import {
	ProposalCategory as OwnedProposalCategory,
	SpecificationRealm as OwnedSpecificationRealm,
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
const githubFilecoinFipProposalRows = async (
	data: {
		type: string
		name: string
	}[]
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return data.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^fip-(?<proposalNumber>\\d+)\\.md$').exec(githubContent.name)?.groups.proposalNumber
		return githubContent.type !== 'file' || proposalNumberRaw == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					realm: SpecificationRealm.Filecoin,
					category: ProposalCategory.Fip,
					number: parseInt(proposalNumberRaw, 10),
				},
			}]
	})
}

export default {
	source: Source.FilecoinFips_Github,

	resolvers: [
		defineResolver(Source.FilecoinFips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: OwnedSpecificationRealm.Filecoin,
							category: OwnedProposalCategory.Fip,
						},
					],
					resolve: async ({ category, number, realm }) => {
					const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
					if (realm !== SpecificationRealm.Filecoin || category !== ProposalCategory.Fip) {
						throw new Error('FilecoinFips_Github: unsupported proposal id')
					}
					const { getMarkdownText } = await import('$/sources/FilecoinFips/Github/queries.ts')
					const text = await getMarkdownText({
						number: number,
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
				}
			}
		})({
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}),

		defineResolver(Source.FilecoinFips_Github, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
						return githubFilecoinFipProposalRows(await getContents())
					},
				}
			}
		})({
			$$proposals: (snapshot) => snapshot,
		}),
	],
}
