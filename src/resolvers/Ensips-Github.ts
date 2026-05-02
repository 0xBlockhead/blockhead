import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const ensipMarkdownFilename = regex('^(?<proposalNumber>\\d+)\\.md$')

const resolveEnsipProposalRows = async () => {
	const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
	const { getEnsipsGithubContents } = await import('$/sources/Ensips/Github/queries.ts')

	const data = await getEnsipsGithubContents()
	const markdownFiles = data.filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
	const rows = []
	for (const markdownFile of markdownFiles) {
		const proposalNumberRaw = ensipMarkdownFilename.exec(markdownFile.name)?.groups?.proposalNumber
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
				const { getEnsipProposalMarkdownText } = await import('$/sources/Ensips/Github/queries.ts')
				const { stripFrontmatter, parseFrontmatter } = await import('$/sources/Github/Rest/client.ts')

				if (entityId.category === ProposalCategory.Caip) throw new Error('Ensips_Github: unsupported proposal category')
				if (entityId.category !== ProposalCategory.Ensip) throw new Error('Proposal body resolver not applicable')
				const text = await singleFlight(getEnsipProposalMarkdownText)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const fm = parseFrontmatter(text)
				const docCategory = fm.category?.trim()
				const docStatus = fm.status?.trim()
				return {
					documentCategory: docCategory != null && docCategory !== '' ? docCategory : null,
					documentTitle: (
						fm.title?.trim()
						|| body.match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1]?.trim()
						|| fm.description?.trim()
						|| null
					),
					documentStatus: docStatus != null && docStatus !== '' ? docStatus : null,
					documentBody: body.length > 0 ? body : null,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposals',
			resolve: async () => resolveEnsipProposalRows(),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.ProposalRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalRealm } = await import('$/constants/Proposal.ts')
				return entityId.realm === ProposalRealm.Ens ? resolveEnsipProposalRows() : []
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.ProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
				return (
					entityId.realm === ProposalRealm.Ens && entityId.category === ProposalCategory.Ensip ?
						resolveEnsipProposalRows()
					:
						[]
				)
			},
		}),
	],
}
