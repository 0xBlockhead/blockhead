import type { EntityFieldResolver } from '$/resolvers/$EntityFieldResolver.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ProposalRealm } from '$/constants/Proposal/ProposalRealm.ts'
import { ProposalCategory } from '$/constants/Proposal/ProposalCategory.ts'
import { getEnsipProposalMarkdownText } from '$/sources/Ensips/Github/queries.ts'
import { ethereumEipSpecGithubRepoByLedger } from '$/sources/EthereumEips/Github/constants.ts'
import type { EthereumEipSpecLedger } from '$/sources/EthereumEips/Github/types.ts'
import {
	getEthereumEipSpecGithubContents,
	getEthereumEipSpecProposalMarkdownText,
	getEthereumEipSpecRawMarkdownText,
	parseFrontmatter,
	stripFrontmatter,
} from '$/sources/EthereumEips/Github/queries.ts'
import type { GhFile } from '$/sources/Github/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

const catalogForLedger = async (ledger: EthereumEipSpecLedger) => {
	const repo = ethereumEipSpecGithubRepoByLedger[ledger]
	const data = await singleFlight(getEthereumEipSpecGithubContents)({ ledger })
	if (!Array.isArray(data)) throw new Error('GitHub (EIPs/ercs): directory response is not an array')
	const files = data.filter((f: GhFile) => f.type === 'file' && f.name.endsWith('.md'))
	const results = await Promise.all(
		files.map(async (f) => {
			const nameMatch = f.name.match(/^(?:eip|erc)-(\d+)\.md$/)
			const num = nameMatch != null ? parseInt(nameMatch[1], 10) : null
			if (num == null) return null
			const fm = parseFrontmatter(
				await singleFlight(getEthereumEipSpecRawMarkdownText)({
					ledger: repo.entryLedger,
					fileName: f.name,
					downloadUrl: f.download_url,
				}),
			)
			const eipNum = fm.eip != null ? parseInt(fm.eip, 10) : num
			const kind = (
				ledger === 'erc' ||
				(fm.type != null && (/^erc$/i.test(fm.type) || /erc/i.test(fm.type))) ||
				(fm.category != null && (/^erc$/i.test(fm.category) || /erc/i.test(fm.category)))
					? ProposalCategory.Erc
					: ProposalCategory.Eip
			)
			return {
				$id: {
					realm: ProposalRealm.Ethereum,
					kind,
					number: eipNum,
				},
				category: fm.category ?? null,
				body: null,
			}
		}),
	)
	return results
		.filter((e) => e != null)
		.sort((a, b) => a.$id.number - b.$id.number)
}

export default {
	source: Source.Eips,
	entityResolvers: [],
	entityFieldResolvers: [
		{
			entityType: EntityType._Global,
			field: '$$proposalsEips',
			resolve: async (_entityId: EntityId<EntityType._Global>) => catalogForLedger('eip'),
		},

		{
			entityType: EntityType._Global,
			field: '$$proposalsErc',
			resolve: async (_entityId: EntityId<EntityType._Global>) => catalogForLedger('erc'),
		},

		{
			entityType: EntityType.Proposal,
			field: 'body',
			resolve: async (entityId) => {
				if (typeof entityId.number !== 'number' || !Number.isFinite(entityId.number))
					return null
				return stripFrontmatter(
					await (
						entityId.kind === ProposalCategory.Ensip ?
							singleFlight(getEnsipProposalMarkdownText)({ number: entityId.number })
						:
							singleFlight(getEthereumEipSpecProposalMarkdownText)({
								ledger: entityId.kind === ProposalCategory.Erc ? 'erc' : 'eip',
								number: entityId.number,
							})
					),
				)
			},
		} satisfies EntityFieldResolver<EntityType.Proposal, 'body'>,
	],
}
