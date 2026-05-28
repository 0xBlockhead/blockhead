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

const githubFilecoinFipProposalRows = async (
	data: {
		type: string
		name: string
	}[],
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return data.flatMap((entry) => {
		const proposalNumberRaw = regex('^fip-(?<proposalNumber>\\d+)\\.md$').exec(entry.name)?.groups?.proposalNumber
		return entry.type !== 'file' || proposalNumberRaw == null ?
			[]
		:	[{
				[EntityMetaKey.Id]: {
					realm: SpecificationRealm.Filecoin,
					category: ProposalCategory.Fip,
					number: parseInt(proposalNumberRaw, 10),
				},
			}]
	})
}

export default {
	source: Source.FilecoinFips_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Filecoin || entityId.category !== ProposalCategory.Fip) {
					throw new Error('FilecoinFips_Github: unsupported proposal id')
				}
				const { getFilecoinFipMarkdownText } = await import('$/sources/FilecoinFips/Github/queries.ts')
				const text = await singleFlight(getFilecoinFipMarkdownText)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const frontmatter = parseFrontmatter(text)
				return {
					documentCategory: frontmatter.type?.trim() === '' ? null : frontmatter.type?.trim() ?? null,
					documentTitle: frontmatter.title?.trim() === '' ? null : frontmatter.title?.trim() ?? null,
					documentStatus: frontmatter.status?.trim() === '' ? null : frontmatter.status?.trim() ?? null,
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
				const { getFilecoinFipsGithubContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await singleFlight(getFilecoinFipsGithubContents)())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Filecoin) {
					throw new Error('FilecoinFips_Github: $$proposals only supports SpecificationRealm.Filecoin')
				}
				const { getFilecoinFipsGithubContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await singleFlight(getFilecoinFipsGithubContents)())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Filecoin || entityId.category !== ProposalCategory.Fip) {
					throw new Error('FilecoinFips_Github: $$proposals only supports Filecoin FIP proposal kind')
				}
				const { getFilecoinFipsGithubContents } = await import('$/sources/FilecoinFips/Github/queries.ts')
				return githubFilecoinFipProposalRows(await singleFlight(getFilecoinFipsGithubContents)())
			},
		}),
	],
}
