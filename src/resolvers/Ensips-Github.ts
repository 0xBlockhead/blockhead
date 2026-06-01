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

const githubEnsipProposalIndexRows = async (
	data: {
		type: string
		name: string
	}[],
) => {
	const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
	const markdownFiles = data.filter((githubContent) => githubContent.type === 'file' && githubContent.name.endsWith('.md'))
	const ensips = []
	for (const markdownFile of markdownFiles) {
		const proposalNumberRaw = regex('^(?<proposalNumber>\\d+)\\.md$').exec(markdownFile.name)?.groups?.proposalNumber
		const proposalNumber = proposalNumberRaw != null ? parseInt(proposalNumberRaw, 10)
		:
			null
		if (proposalNumber == null) continue
		ensips.push({
			[EntityMetaKey.Id]: {
				realm: SpecificationRealm.Ens,
				category: ProposalCategory.Ensip,
				number: proposalNumber,
			},
		})
	}
	return ensips
}

export default {
	source: Source.Ensips_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.SpecificationProposal,
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				const {
					getProposalMarkdownText,
				} = await import('$/sources/Ensips/Github/queries.ts')

				if (entityId.realm !== SpecificationRealm.Ens || entityId.category !== ProposalCategory.Ensip) {
					throw new Error('Ensips_Github: proposal resolver only supports ENSIPs')
				}
				const text = await singleFlight(getProposalMarkdownText)({ number: entityId.number })
				const body = stripFrontmatter(text)
				const fm = parseFrontmatter(text)
				return {
					documentCategory: (
						((docCategory) => (
							docCategory != null && docCategory !== '' ? docCategory : null
						))(fm.category?.trim())
					),
					documentTitle: (
						fm.title?.trim()
						|| body.match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1]?.trim()
						|| fm.description?.trim()
						|| null
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
				const { getContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Ens) {
					throw new Error('Ensips_Github: $$proposals only supports SpecificationRealm.Ens')
				}
				const { getContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getContents())
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { ProposalCategory, SpecificationRealm } = await import('$/constants/SpecificationProposal.ts')
				if (entityId.realm !== SpecificationRealm.Ens || entityId.category !== ProposalCategory.Ensip) {
					throw new Error('Ensips_Github: $$proposals only supports ENSIP proposal kind')
				}
				const { getContents } = await import('$/sources/Ensips/Github/queries.ts')
				return githubEnsipProposalIndexRows(await getContents())
			},
		}),
	],
}
