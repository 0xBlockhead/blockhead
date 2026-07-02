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
				[EntityMetaKey.Selector]: {
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
		defineResolver(Source.CosmosAdrs_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				[SpecificationProposalSelector.RealmCategoryNumber]: async ({ category, number, realm }) => {
					const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
					if (realm !== SpecificationRealm.Cosmos || category !== ProposalCategory.Adr) {
						throw new Error('CosmosAdrs_Github: proposal resolver only supports Cosmos SDK ADRs')
					}
					const { getMarkdownText } = await import('$/sources/CosmosAdrs/Github/queries.ts')
					const text = await getMarkdownText({ number: number })
					return {
						documentCategory: 'ADR',
						documentTitle: markdownTitle(text),
						documentStatus: markdownStatus(text),
						documentBody: text,
					}
				},
			},
		})({
			fields: {
				documentCategory: (snapshot) => snapshot.documentCategory,
				documentTitle: (snapshot) => snapshot.documentTitle,
				documentStatus: (snapshot) => snapshot.documentStatus,
				documentBody: (snapshot) => snapshot.documentBody,
			},
		}),

		defineResolver(Source.CosmosAdrs_Github, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
					const { getContents } = await import('$/sources/CosmosAdrs/Github/queries.ts')
					return cosmosAdrRows(await getContents())
				},
			},
		})({
			fields: {
				$$proposals: (snapshot) => snapshot,
			},
		}),
	],
}
