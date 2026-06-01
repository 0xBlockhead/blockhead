import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { parseFrontmatter, stripFrontmatter } from '$/lib/markdownFrontmatter.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const solanaSimdProposalRows = async (
	entries: {
		type: string
		name: string
	}[],
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^(?<proposalNumber>\\d+)-.+\\.md$').exec(githubContent.name)?.groups?.proposalNumber
		const proposalNumber = proposalNumberRaw != null ? parseInt(proposalNumberRaw, 10)
		:
			null
		return githubContent.type !== 'file' || proposalNumber == null ?
			[]
		:
			[{
				[EntityMetaKey.Id]: {
					realm: SpecificationRealm.Solana,
					category: ProposalCategory.Simd,
					number: proposalNumber,
				},
			}]
	})
}

export default {
	source: Source.SolanaSimds_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Solana || entityId.category !== ProposalCategory.Simd) {
					throw new Error('SolanaSimds_Github: unsupported proposal id')
				}
				const { getProposalMarkdownText } = await import('$/sources/SolanaSimds/Github/queries.ts')
				const text = await singleFlight(getProposalMarkdownText)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const frontmatter = parseFrontmatter(text)
				return {
					documentCategory: frontmatter.category?.trim() || 'SIMD',
					documentTitle: (
						frontmatter.title?.trim()
						|| body.match(/^#\s*(.+)$/m)?.[1]?.trim()
						|| null
					),
					documentStatus: frontmatter.status?.trim() || null,
					documentBody: body.length > 0 ? body : null,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposals',
			resolve: async () => {
				const { getProposalContents } = await import('$/sources/SolanaSimds/Github/queries.ts')
				return solanaSimdProposalRows(await singleFlight(getProposalContents)())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Solana) {
					throw new Error('SolanaSimds_Github: $$proposals only supports SpecificationRealm.Solana')
				}
				const { getProposalContents } = await import('$/sources/SolanaSimds/Github/queries.ts')
				return solanaSimdProposalRows(await singleFlight(getProposalContents)())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Solana || entityId.category !== ProposalCategory.Simd) {
					throw new Error('SolanaSimds_Github: $$proposals only supports Solana SIMD proposal kind')
				}
				const { getProposalContents } = await import('$/sources/SolanaSimds/Github/queries.ts')
				return solanaSimdProposalRows(await singleFlight(getProposalContents)())
			},
		}),
	],
}
