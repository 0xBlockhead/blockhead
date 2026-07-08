import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { SpecificationProposalSelector } from '$/schema/SpecificationProposal.ts'

const polkadotRfcRows = async (entries: { type: string, name: string }[]) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	return entries.flatMap((githubContent) => {
		const proposalNumberRaw = regex('^(?<proposalNumber>\\d{4})\\.md$').exec(githubContent.name)?.groups.proposalNumber
		return githubContent.type !== 'file' || proposalNumberRaw == null ?
			[]
		:
			[{
				[EntityMetaKey.Selector]: {
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
		defineResolver(Source.PolkadotRfcs_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (realm !== SpecificationRealm.Polkadot || category !== ProposalCategory.Rfc) {
					throw new Error('PolkadotRfcs_Github: proposal resolver only supports Polkadot Fellowship RFCs')
				}
				const { getMarkdownText } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				const text = await getMarkdownText({ number: number })
				return {
					documentCategory: 'RFC',
					documentTitle: text.match(/^#\s*(.+)$/m)?.[1]?.trim(),
					documentStatus: text.match(/^Status:\s*(.+)$/im)?.[1]?.trim(),
					documentBody: text,
				}
			}
			}
		})({
			documentCategory: (snapshot) => snapshot.documentCategory,
			documentTitle: (snapshot) => snapshot.documentTitle,
			documentStatus: (snapshot) => snapshot.documentStatus,
			documentBody: (snapshot) => snapshot.documentBody,
		}),

		defineResolver(Source.PolkadotRfcs_Github, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
				const { getContents } = await import('$/sources/PolkadotRfcs/Github/queries.ts')
				return polkadotRfcRows(await getContents())
			}
			}
		})({
			$$proposals: (snapshot) => snapshot,
		}),
	],
}
