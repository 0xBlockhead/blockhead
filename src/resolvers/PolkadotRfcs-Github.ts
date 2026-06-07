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

const polkadotRfcRows = async (entries: { type: string, name: string }[]) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^(?<proposalNumber>\\d{4})\\.md$').exec(githubContent.name)?.groups.proposalNumber
		return githubContent.type !== 'file' || proposalNumberRaw == null ?
			[]
		:
			[{
				[EntityMetaKey.Id]: {
					realm: SpecificationRealm.Polkadot,
					category: ProposalCategory.Rfc,
					number: parseInt(proposalNumberRaw, 10),
				},
			}]
	})
}

export default {
	source: Source.PolkadotRfcs_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.SpecificationProposal,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Polkadot || entityId.category !== ProposalCategory.Rfc) {
					throw new Error('PolkadotRfcs_Github: proposal resolver only supports Polkadot Fellowship RFCs')
				}
				const { getMarkdownText } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				const text = await singleFlight(getMarkdownText)({ number: entityId.number })
				return {
					documentCategory: 'RFC',
					documentTitle: text.match(/^#\s*(.+)$/m)?.[1]?.trim(),
					documentStatus: text.match(/^Status:\s*(.+)$/im)?.[1]?.trim(),
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
				const { getContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				return polkadotRfcRows(await getContents())
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
				if (entityId.realm !== SpecificationRealm.Polkadot) throw new Error('PolkadotRfcs_Github: $$proposals only supports Polkadot')
				const { getContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				return polkadotRfcRows(await getContents())
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
				if (entityId.realm !== SpecificationRealm.Polkadot || entityId.category !== ProposalCategory.Rfc) throw new Error('PolkadotRfcs_Github: $$proposals only supports Polkadot RFCs')
				const { getContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				return polkadotRfcRows(await getContents())
			},
			fields: {
			$$proposals: (snapshot) => snapshot,
		}
		}),
	],
}
