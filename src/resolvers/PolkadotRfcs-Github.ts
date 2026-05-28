import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { regex } from 'arkregex'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const polkadotRfcRows = async (entries: { type: string, name: string }[]) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((entry) => {
		const proposalNumberRaw = regex('^(?<proposalNumber>\\d{4})\\.md$').exec(entry.name)?.groups?.proposalNumber
		return entry.type !== 'file' || proposalNumberRaw == null ?
			[]
		:	[{
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Polkadot || entityId.category !== ProposalCategory.Rfc) {
					throw new Error('PolkadotRfcs_Github: proposal resolver only supports Polkadot Fellowship RFCs')
				}
				const { getPolkadotRfcMarkdownText } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				const text = await singleFlight(getPolkadotRfcMarkdownText)({ number: entityId.number })
				return {
					documentCategory: 'RFC',
					documentTitle: text.match(/^#\s*(.+)$/m)?.[1]?.trim() ?? null,
					documentStatus: text.match(/^Status:\s*(.+)$/im)?.[1]?.trim() ?? null,
					documentBody: text,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposals',
			resolve: async () => {
				const { getPolkadotRfcsGithubContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				return polkadotRfcRows(await getPolkadotRfcsGithubContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Polkadot) throw new Error('PolkadotRfcs_Github: $$proposals only supports Polkadot')
				const { getPolkadotRfcsGithubContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				return polkadotRfcRows(await getPolkadotRfcsGithubContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Polkadot || entityId.category !== ProposalCategory.Rfc) throw new Error('PolkadotRfcs_Github: $$proposals only supports Polkadot RFCs')
				const { getPolkadotRfcsGithubContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				return polkadotRfcRows(await getPolkadotRfcsGithubContents())
			},
		}),
	],
}
