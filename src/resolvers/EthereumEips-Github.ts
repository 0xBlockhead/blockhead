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
	getContents,
}: {
	category?: typeof import('$/constants/SpecificationProposal.ts').ProposalCategory.Eip
	| typeof import('$/constants/SpecificationProposal.ts').ProposalCategory.Erc
	getContents: (input: { ledger: 'eip' | 'erc' }) => Promise<{
		type: string
		name: string
	}[]>
}) => {
	const { ProposalCategory } = await import('$/constants/SpecificationProposal.ts')
	const ledgers = (
		category === ProposalCategory.Erc ?
			[{ ledger: 'erc' as const, category: ProposalCategory.Erc }]
		: category === ProposalCategory.Eip ?
			[{ ledger: 'eip' as const, category: ProposalCategory.Eip }]
		:
			[
				{ ledger: 'eip' as const, category: ProposalCategory.Eip },
				{ ledger: 'erc' as const, category: ProposalCategory.Erc },
			]
	)
	const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	const byLedger = await Promise.all(
		ledgers.map(async ({ ledger, category: cat }) => ({
			category: cat,
			data: await singleFlight(getContents)({ ledger }),
		})),
	)
	const specificationProposals: {
		[EntityMetaKey.Id]: {
			realm: typeof SpecificationRealm.Ethereum
			category: typeof ProposalCategory.Eip | typeof ProposalCategory.Erc
			number: number
		}
	}[] = []
	for (const { category: cat, data } of byLedger) {
		for (const githubContent of data) {
			if (githubContent.type !== 'file' || !githubContent.name.endsWith('.md')) continue
				const proposalNumberRaw = regex('^(?:eip|erc)-(?<proposalNumber>\\d+)\\.md$').exec(githubContent.name)?.groups?.proposalNumber
				const proposalNumber = proposalNumberRaw != null ? parseInt(proposalNumberRaw, 10)
				:
					null
				if (proposalNumber == null) continue
				specificationProposals.push({
					[EntityMetaKey.Id]: {
						realm: SpecificationRealm.Ethereum,
						category: cat === ProposalCategory.Erc ? ProposalCategory.Erc : ProposalCategory.Eip,
						number: proposalNumber,
					},
				})
			}
	}
	return specificationProposals
}

export default {
	source: Source.EthereumEips_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const {
					getProposalMarkdownText,
				} = await import('$/sources/EthereumEips/Github/queries.ts')

				if (
					entityId.realm !== SpecificationRealm.Ethereum
					|| (entityId.category !== ProposalCategory.Eip && entityId.category !== ProposalCategory.Erc)
				) {
					throw new Error('EthereumEips_Github: proposal resolver only supports Ethereum EIPs/ERCs')
				}
				const text = await singleFlight(getProposalMarkdownText)({
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
				const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
				return ethereumEipErcProposalRowsFromGithubSpecs({
					getContents,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Ethereum) {
					throw new Error('EthereumEips_Github: $$proposals only supports SpecificationRealm.Ethereum')
				}
				const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
				return ethereumEipErcProposalRowsFromGithubSpecs({
					getContents,
				})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (
					entityId.realm !== SpecificationRealm.Ethereum
					|| (entityId.category !== ProposalCategory.Eip && entityId.category !== ProposalCategory.Erc)
				) {
					throw new Error('EthereumEips_Github: $$proposals only supports Ethereum EIP/ERC proposal kinds')
				}
				const { getContents } = await import('$/sources/EthereumEips/Github/queries.ts')
				return ethereumEipErcProposalRowsFromGithubSpecs({
					category: entityId.category,
					getContents,
				})
			},
		}),
	],
}
