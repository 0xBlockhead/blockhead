import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { regex } from 'arkregex'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
const bipMetadataValue = (text: string, key: string) => (
	new RegExp(`^\\s*${key}:\\s*(.+?)\\s*$`, 'im').exec(text)?.[1]?.trim()
)

export default {
	source: Source.BitcoinBips_Github,

	resolvers: [
		defineResolver(Source.BitcoinBips_Github, {
			entityType: EntityType.SpecificationProposal,
			resolve: {
				RealmCategoryNumber: {
					appliesTo: [
						{
							realm: SpecificationRealm.Bitcoin,
							category: ProposalCategory.Bip,
						},
					],
					resolve: async ({ category, number, realm }) => {
						const { getProposalMediaWikiText } = await import('$/sources/BitcoinBips/Github/queries.ts')
						if (realm !== SpecificationRealm.Bitcoin || category !== ProposalCategory.Bip) {
							throw new Error('BitcoinBips_Github: proposal resolver only supports Bitcoin BIPs')
						}
						const text = await getProposalMediaWikiText({
							number,
						})
						if (text.trim() === '') throw new Error('BitcoinBips_Github: empty proposal text')
						return {
							documentCategory: bipMetadataValue(text, 'Type'),
							documentTitle: bipMetadataValue(text, 'Title'),
							documentStatus: bipMetadataValue(text, 'Status'),
							documentBody: text,
						}
					},
				},
			},
		})({
				documentCategory: (snapshot) => snapshot.documentCategory,
				documentTitle: (snapshot) => snapshot.documentTitle,
				documentStatus: (snapshot) => snapshot.documentStatus,
				documentBody: (snapshot) => snapshot.documentBody,
			}),

		defineResolver(Source.BitcoinBips_Github, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { getContents } = await import('$/sources/BitcoinBips/Github/queries.ts')
						return (await getContents())
							.flatMap((githubContent) => {
								const proposalNumberRaw = (
									githubContent.type === 'file' ?
										regex('^bip-(?<proposalNumber>\\d{4})\\.mediawiki$').exec(githubContent.name)?.groups.proposalNumber
									:
										null
								)
								return proposalNumberRaw == null ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: {
												realm: SpecificationRealm.Bitcoin,
												category: ProposalCategory.Bip,
												number: parseInt(proposalNumberRaw, 10),
											},
										},
									]
							})
					},
				},
			},
		})({
				$$proposals: (snapshot) => snapshot,
			}),
	],
}
