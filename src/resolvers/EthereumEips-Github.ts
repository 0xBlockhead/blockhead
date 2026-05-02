import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const eipOrErcMarkdownFilename = regex('^(?:eip|erc)-(?<proposalNumber>\\d+)\\.md$')

const resolveEthereumProposalRows = async () => {
	const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
	const { getEthereumEipSpecGithubContents } = await import('$/sources/EthereumEips/Github/queries.ts')
	const byLedger = await Promise.all([
		{
			ledger: 'eip' as const,
			category: ProposalCategory.Eip,
		},
		{
			ledger: 'erc' as const,
			category: ProposalCategory.Erc,
		},
	].map(async ({ ledger, category }) => ({
		category,
		data: await singleFlight(getEthereumEipSpecGithubContents)({ ledger }),
	})))
	return [...byLedger
		.flatMap(({ category, data }) => (
			data
				.filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
				.flatMap((markdownFile) => {
					const proposalNumberRaw = eipOrErcMarkdownFilename.exec(markdownFile.name)?.groups?.proposalNumber
					const proposalNumber = proposalNumberRaw != null ? parseInt(proposalNumberRaw, 10) : null
					return proposalNumber == null ?
						[]
					:	[{
							[EntityMetaKey.Id]: {
								realm: ProposalRealm.Ethereum,
								category,
								number: proposalNumber,
							},
						}]
				})
		))
		.reduce((rowsByProposalKey, proposalRow) => (
			rowsByProposalKey.set(
				`${proposalRow[EntityMetaKey.Id].realm}:${proposalRow[EntityMetaKey.Id].category}:${proposalRow[EntityMetaKey.Id].number}`,
				proposalRow,
			)
		), new Map())]
		.map(([, proposalRow]) => proposalRow)
		.sort((firstProposalRow, secondProposalRow) => (
			firstProposalRow[EntityMetaKey.Id].number - secondProposalRow[EntityMetaKey.Id].number
		))
}

export default {
	source: Source.EthereumEips_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Proposal,
			resolve: async (entityId) => {
				const { ProposalCategory } = await import('$/constants/Proposal.ts')
				const {
					getEthereumEipSpecProposalMarkdownText,
					parseFrontmatter,
					stripFrontmatter,
				} = await import('$/sources/EthereumEips/Github/queries.ts')

				if (entityId.category === ProposalCategory.Ensip) throw new Error('Proposal body resolver not applicable')
				if (entityId.category === ProposalCategory.Caip) throw new Error('EthereumEips_Github: unsupported proposal category')
				const text = await singleFlight(getEthereumEipSpecProposalMarkdownText)({
					ledger: entityId.category === ProposalCategory.Erc ? 'erc' : 'eip',
					number: entityId.number,
				})
				const body = stripFrontmatter(text)
				const fm = parseFrontmatter(text)
				const docCategory = fm.category?.trim()
				const docTitle = fm.title?.trim()
				const docStatus = fm.status?.trim()
				return {
					documentCategory: docCategory != null && docCategory !== '' ? docCategory : null,
					documentTitle: docTitle != null && docTitle !== '' ? docTitle : null,
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
			resolve: async () => resolveEthereumProposalRows(),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.ProposalRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalRealm } = await import('$/constants/Proposal.ts')
				return entityId.realm === ProposalRealm.Ethereum ? resolveEthereumProposalRows() : []
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.ProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
				if (
					entityId.realm !== ProposalRealm.Ethereum
					|| (entityId.category !== ProposalCategory.Eip && entityId.category !== ProposalCategory.Erc)
				) return []
				return (
					(await resolveEthereumProposalRows())
						.filter((proposalRow) => proposalRow[EntityMetaKey.Id].category === entityId.category)
				)
			},
		}),
	],
}
