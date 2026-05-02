import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const caipMarkdownFilename = regex('^caip-(?<caipNumber>\\d+)\\.md$')

const resolveCaipProposalRows = async () => {
	const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
	const { getCaipsGithubContents } = await import('$/sources/Caips/Github/queries.ts')

	const data = await singleFlight(getCaipsGithubContents)()
	const markdownFiles = data.filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
	return [...markdownFiles
		.flatMap((markdownFile) => {
			const caipNumberRaw = caipMarkdownFilename.exec(markdownFile.name)?.groups?.caipNumber
			const caipNumber = caipNumberRaw != null ? parseInt(caipNumberRaw, 10) : null
			return caipNumber == null ?
				[]
			:	[{
					[EntityMetaKey.Id]: {
						realm: ProposalRealm.ChainAgnostic,
						category: ProposalCategory.Caip,
						number: caipNumber,
					},
				}]
		})
		.reduce((rowsByProposalKey, proposalRow) => (
			rowsByProposalKey.set(
				`${proposalRow[EntityMetaKey.Id].realm}:${proposalRow[EntityMetaKey.Id].category}:${proposalRow[EntityMetaKey.Id].number}`,
				proposalRow,
			)
		), new Map())]
		.map(([, proposalRow]) => proposalRow)
		.sort((firstRow, secondRow) => (
			firstRow[EntityMetaKey.Id].number - secondRow[EntityMetaKey.Id].number
		))
}

export default {
	source: 'Caips_Github' satisfies import('$/sources/$Source.ts').Source,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Proposal,
			resolve: async (entityId) => {
				const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
				const {
					getCaipMarkdownTextForNumber,
					parseFrontmatter,
					stripFrontmatter,
				} = await import('$/sources/Caips/Github/queries.ts')

				if (
					entityId.category !== ProposalCategory.Caip
					|| entityId.realm !== ProposalRealm.ChainAgnostic
				) throw new Error('Caips_Github: unsupported proposal id')
				const text = await singleFlight(getCaipMarkdownTextForNumber)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const frontmatter = parseFrontmatter(text)
				const docCategory = frontmatter.type?.trim()
				const docTitle = frontmatter.title?.trim()
				const docStatus = frontmatter.status?.trim()
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
			resolve: async () => resolveCaipProposalRows(),
		}),
		defineEntityFieldResolver({
			entityType: EntityType.ProposalRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalRealm } = await import('$/constants/Proposal.ts')
				return entityId.realm === ProposalRealm.ChainAgnostic ? resolveCaipProposalRows() : []
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.ProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, ProposalRealm } = await import('$/constants/Proposal.ts')
				return (
					entityId.realm === ProposalRealm.ChainAgnostic && entityId.category === ProposalCategory.Caip ?
						resolveCaipProposalRows()
					:
						[]
				)
			},
		}),
	],
}
