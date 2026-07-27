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
const solanaSimdProposalRows = async (
	entries: {
		type: string
		name: string
	}[]
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^(?<proposalNumber>\\d+)-.+\\.md$').exec(githubContent.name)?.groups.proposalNumber
		const proposalNumber = proposalNumberRaw != null ?
			parseInt(proposalNumberRaw, 10)
		:
			null

		return githubContent.type !== 'file' || proposalNumber == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
					realm: SpecificationRealm.Solana,
					category: ProposalCategory.Simd,
					number: proposalNumber,
				},
			}]
	})
}

export default {
	source: Source.SolanaSimds_Github,

	resolvers: [
		defineResolver(Source.SolanaSimds_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: OwnedSpecificationRealm.Solana,
							category: OwnedProposalCategory.Simd,
						},
					],
					resolve: async ({ category, number, realm }) => {
					const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
					if (realm !== SpecificationRealm.Solana || category !== ProposalCategory.Simd) {
						throw new Error('SolanaSimds_Github: unsupported proposal id')
					}
					const { getProposalMarkdownText } = await import('$/sources/SolanaSimds/Github/queries.ts')
					const text = await getProposalMarkdownText({
						number: number,
					})
					const body = stripFrontmatter(text)
					const frontmatter = parseFrontmatter(text)
					return {
						documentCategory: frontmatter.category.trim() || 'SIMD',
						documentTitle: (
							frontmatter.title.trim()
							|| body.match(/^#\s*(.+)$/m)?.[1]?.trim()
						),
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

		defineResolver(Source.SolanaSimds_Github, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getProposalContents } = await import('$/sources/SolanaSimds/Github/queries.ts')
						return solanaSimdProposalRows(await getProposalContents())
					},
				}
			}
		})({
			$$proposals: (snapshot) => snapshot,
		}),
	],
}
