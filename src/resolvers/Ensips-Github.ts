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

const githubEnsipProposalIndexRows = async (
	data: {
		type: string
		name: string
	}[],
) => {
	const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
	const markdownFiles = data.filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
	const rows = []
	for (const markdownFile of markdownFiles) {
		const proposalNumberRaw = regex('^(?<proposalNumber>\\d+)\\.md$').exec(markdownFile.name)?.groups?.proposalNumber
		const proposalNumber = proposalNumberRaw != null ? parseInt(proposalNumberRaw, 10) : null
		if (proposalNumber == null) continue
		rows.push({
			[EntityMetaKey.Id]: {
				realm: ProposalRealm.Ens,
				category: ProposalCategory.Ensip,
				number: proposalNumber,
			},
		})
	}
	rows.sort((firstProposalRow, secondProposalRow) => (
		firstProposalRow[EntityMetaKey.Id].number - secondProposalRow[EntityMetaKey.Id].number
	))
	return rows
}

export default {
	source: Source.Ensips_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Proposal,
			resolve: async (entityId) => {
				const { ProposalCategory } = await import('$/constants/Proposal.ts')
				const {
					getEnsipProposalMarkdownText,
				} = await import('$/sources/Ensips/Github/queries.ts')

				if (entityId.category === ProposalCategory.Caip) throw new Error('Ensips_Github: unsupported proposal category')
				if (entityId.category !== ProposalCategory.Ensip) throw new Error('Proposal body resolver not applicable')
				const text = await singleFlight(getEnsipProposalMarkdownText)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const fm = parseFrontmatter(text)
				return {
					documentCategory: (
						((docCategory) => (
							docCategory != null && docCategory !== '' ? docCategory : null
						))(fm.category?.trim())
					),
					documentTitle: (
						fm.title?.trim()
						|| body.match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1]?.trim()
						|| fm.description?.trim()
						|| null
					),
					documentStatus: (
						((docStatus) => (
							docStatus != null && docStatus !== '' ? docStatus : null
						))(fm.status?.trim())
					),
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
				const { getEnsipsGithubContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getEnsipsGithubContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ProposalRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalRealm } = await import('$/constants/Proposal.ts')
				if (entityId.realm !== ProposalRealm.Ens) {
					throw new Error('Ensips_Github: $$proposals only supports ProposalRealm.Ens')
				}
				const { getEnsipsGithubContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getEnsipsGithubContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
				if (entityId.realm !== ProposalRealm.Ens || entityId.category !== ProposalCategory.Ensip) {
					throw new Error('Ensips_Github: $$proposals only supports ENSIP proposal kind')
				}
				const { getEnsipsGithubContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getEnsipsGithubContents())
			},
		}),
	],
}
