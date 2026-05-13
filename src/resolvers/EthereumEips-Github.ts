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

const ethereumEipErcProposalRowsFromGithubSpecs = async ({
	category,
	getEthereumEipSpecGithubContents,
}: {
	category?: typeof import('$/constants/Proposal.ts').ProposalCategory.Eip
	| typeof import('$/constants/Proposal.ts').ProposalCategory.Erc
	getEthereumEipSpecGithubContents: (input: { ledger: 'eip' | 'erc' }) => Promise<{
		type: string
		name: string
	}[]>
}) => {
	const { ProposalCategory } = await import('$/constants/Proposal.ts')
	const ledgers = (
		category === ProposalCategory.Erc ?
			[{ ledger: 'erc' as const, category: ProposalCategory.Erc }]
		: category === ProposalCategory.Eip ?
			[{ ledger: 'eip' as const, category: ProposalCategory.Eip }]
		:	[
				{ ledger: 'eip' as const, category: ProposalCategory.Eip },
				{ ledger: 'erc' as const, category: ProposalCategory.Erc },
			]
	)
	const { ProposalRealm } = await import('$/constants/Proposal.ts')
	const byLedger = await Promise.all(
		ledgers.map(async ({ ledger, category: cat }) => ({
			category: cat,
			data: await singleFlight(getEthereumEipSpecGithubContents)({ ledger }),
		})),
	)
	const rowsByProposalKey = new Map<
		string,
		{ [EntityMetaKey.Id]: { realm: typeof ProposalRealm.Ethereum, category: typeof ProposalCategory.Eip | typeof ProposalCategory.Erc, number: number } }
	>()
	for (const { category: cat, data } of byLedger) {
		for (const entry of data) {
			if (entry.type !== 'file' || !entry.name.endsWith('.md')) continue
			const proposalNumberRaw = regex('^(?:eip|erc)-(?<proposalNumber>\\d+)\\.md$').exec(entry.name)?.groups?.proposalNumber
			const proposalNumber = proposalNumberRaw != null ? parseInt(proposalNumberRaw, 10) : null
			if (proposalNumber == null) continue
			const id = { realm: ProposalRealm.Ethereum, category: cat, number: proposalNumber }
			rowsByProposalKey.set(`${id.realm}:${id.category}:${id.number}`, { [EntityMetaKey.Id]: id })
		}
	}
	return [...rowsByProposalKey.values()]
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
				} = await import('$/sources/EthereumEips/Github/queries.ts')

				if (entityId.category === ProposalCategory.Ensip) throw new Error('Proposal body resolver not applicable')
				if (entityId.category === ProposalCategory.Caip) throw new Error('EthereumEips_Github: unsupported proposal category')
				const text = await singleFlight(getEthereumEipSpecProposalMarkdownText)({
					ledger: entityId.category === ProposalCategory.Erc ? 'erc' : 'eip',
					number: entityId.number,
				})
				if (text.trim() === '') throw new Error('EthereumEips_Github: empty proposal markdown')
				const body = stripFrontmatter(text)
				const fm = parseFrontmatter(text)
				return {
					documentCategory: (
						((docCategory) => (
							docCategory != null && docCategory !== '' ? docCategory : null
						))(fm.category?.trim())
					),
					documentTitle: (
						((docTitle) => (
							docTitle != null && docTitle !== '' ? docTitle : null
						))(fm.title?.trim())
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
				const { getEthereumEipSpecGithubContents } = await import('$/sources/EthereumEips/Github/queries.ts')
				return ethereumEipErcProposalRowsFromGithubSpecs({
					getEthereumEipSpecGithubContents,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ProposalRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalRealm } = await import('$/constants/Proposal.ts')
				if (entityId.realm !== ProposalRealm.Ethereum) {
					throw new Error('EthereumEips_Github: $$proposals only supports ProposalRealm.Ethereum')
				}
				const { getEthereumEipSpecGithubContents } = await import('$/sources/EthereumEips/Github/queries.ts')
				return ethereumEipErcProposalRowsFromGithubSpecs({
					getEthereumEipSpecGithubContents,
				})
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
				) {
					throw new Error('EthereumEips_Github: $$proposals only supports Ethereum EIP/ERC proposal kinds')
				}
				const { getEthereumEipSpecGithubContents } = await import('$/sources/EthereumEips/Github/queries.ts')
				return ethereumEipErcProposalRowsFromGithubSpecs({
					category: entityId.category,
					getEthereumEipSpecGithubContents,
				})
			},
		}),
	],
}
