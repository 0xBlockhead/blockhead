import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const markdownTitle = (text: string) => text.match(/^#\s*(.+)$/m)?.[1]?.trim()

const markdownStatus = (text: string) => (
	text.match(/^##\s*Status\s*\n+(.+)$/im)?.[1]?.trim()
	?? text.match(/^Status:\s*(.+)$/im)?.[1]?.trim()
)

const cosmosAdrRows = async (entries: { type: string, name: string }[]) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^adr-(?<proposalNumber>\\d{3})\\.md$').exec(githubContent.name)?.groups.proposalNumber
		return githubContent.type !== 'file' || proposalNumberRaw == null ?
			[]
		:
			[{
				[EntityMetaKey.Id]: {
					realm: SpecificationRealm.Cosmos,
					category: ProposalCategory.Adr,
					number: parseInt(proposalNumberRaw, 10),
				},
			}]
	})
}

export default {
	source: Source.CosmosAdrs_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Cosmos || entityId.category !== ProposalCategory.Adr) {
					throw new Error('CosmosAdrs_Github: proposal resolver only supports Cosmos SDK ADRs')
				}
				const { getMarkdownText } = await import('$/sources/CosmosAdrs/Github/queries.ts')
				const text = await singleFlight(getMarkdownText)({ number: entityId.number })
				return {
					documentCategory: 'ADR',
					documentTitle: markdownTitle(text),
					documentStatus: markdownStatus(text),
					documentBody: text,
				}
			},
			fields: {
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				const { getContents } = await import('$/sources/CosmosAdrs/Github/queries.ts')
				return cosmosAdrRows(await getContents())
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationRealm,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Cosmos) throw new Error('CosmosAdrs_Github: $$proposals only supports Cosmos')
				const { getContents } = await import('$/sources/CosmosAdrs/Github/queries.ts')
				return cosmosAdrRows(await getContents())
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.SpecificationProposalKind,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Cosmos || entityId.category !== ProposalCategory.Adr) throw new Error('CosmosAdrs_Github: $$proposals only supports Cosmos ADRs')
				const { getContents } = await import('$/sources/CosmosAdrs/Github/queries.ts')
				return cosmosAdrRows(await getContents())
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),
	],
}
