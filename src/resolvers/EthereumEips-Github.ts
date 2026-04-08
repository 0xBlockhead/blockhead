import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import {
	type EntityId,
	schema,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { ProposalCategory } from '$/constants/Proposal/ProposalCategory.ts'
import { ProposalRealm } from '$/constants/Proposal/ProposalRealm.ts'
import type { EthereumEipSpecLedger } from '$/sources/EthereumEips/Github/types.ts'
import type { GhFile } from '$/sources/Github/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

const catalogForLedger = async (ledger: EthereumEipSpecLedger) => {
	const { singleFlight } = await import('$/lib/singleFlight.ts')
	const {
		getEthereumEipSpecGithubContents,
	} = await import('$/sources/EthereumEips/Github/queries.ts')
	const data = await singleFlight(getEthereumEipSpecGithubContents)({ ledger })
	if (!Array.isArray(data)) throw new Error('GitHub (EIPs/ercs): directory response is not an array')
	const files = data.filter((f: GhFile) => f.type === 'file' && f.name.endsWith('.md'))
	return [...files
		.flatMap((f) => {
			const nameMatch = f.name.match(/^(?:eip|erc)-(\d+)\.md$/)
			const number = nameMatch != null ? parseInt(nameMatch[1], 10) : null
			return number == null ?
				[]
			:	[{
					[EntityMetaKey.Id]: {
						realm: ProposalRealm.Ethereum,
						category: ledger === 'erc' ? ProposalCategory.Erc : ProposalCategory.Eip,
						number,
					},
				}]
		})
		.reduce((rowsById, row) => (
			rowsById.set(
				`${row[EntityMetaKey.Id].realm}:${row[EntityMetaKey.Id].category}:${row[EntityMetaKey.Id].number}`,
				row,
			)
		), new Map())]
		.map(([, row]) => row)
		.sort((a, b) => a[EntityMetaKey.Id].number - b[EntityMetaKey.Id].number)
}

const proposalBodyResolverNotApplicable = () => {
	throw new Error('Proposal body resolver not applicable')
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Proposal,
			source: Source.Eips,
			resolve: async (entityId) => {
				if (entityId.category === ProposalCategory.Ensip) proposalBodyResolverNotApplicable()
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const {
					getEthereumEipSpecProposalMarkdownText,
					parseFrontmatter,
					stripFrontmatter,
				} = await import('$/sources/EthereumEips/Github/queries.ts')
				if (typeof entityId.number !== 'number' || !Number.isFinite(entityId.number))
					return {}
				const text = await singleFlight(getEthereumEipSpecProposalMarkdownText)({
					ledger: entityId.category === ProposalCategory.Erc ? 'erc' : 'eip',
					number: entityId.number,
				})
				const body = stripFrontmatter(text)
				const category = parseFrontmatter(text).category?.trim()
				return {
					category: category != null && category !== '' ? category : null,
					body: body.length > 0 ? body : null,
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposalsEips',
			source: Source.Eips,
			resolve: async (_entityId: EntityId<typeof schema, EntityType._Global>) => catalogForLedger('eip'),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposalsErc',
			source: Source.Eips,
			resolve: async (_entityId: EntityId<typeof schema, EntityType._Global>) => catalogForLedger('erc'),
		}),
	],
}
