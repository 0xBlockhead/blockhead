import { describe, expect, it, vi } from 'vitest'

import {
	ProposalCategory,
	SpecificationRealm,
} from '$/constants/SpecificationProposal.ts'
import {
	indexResolvers,
	resolverDefinitionsKey,
} from '$/resolvers/$resolvers.ts'
import bitcoinBips from '$/resolvers/BitcoinBips-Github.ts'
import bitcoinCashChips from '$/resolvers/BitcoinCashChips-Gitlab.ts'
import caips from '$/resolvers/Caips-Github.ts'
import cosmosAdrs from '$/resolvers/CosmosAdrs-Github.ts'
import dogecoinDips from '$/resolvers/DogecoinDips-Github.ts'
import ensips from '$/resolvers/Ensips-Github.ts'
import ethereumEips from '$/resolvers/EthereumEips-Github.ts'
import filecoinFips from '$/resolvers/FilecoinFips-Github.ts'
import hyperliquidDocs from '$/resolvers/HyperliquidDocs-Rest.ts'
import litecoinLips from '$/resolvers/LitecoinLips-Github.ts'
import nearNeps from '$/resolvers/NearNeps-Github.ts'
import polkadotRfcs from '$/resolvers/PolkadotRfcs-Github.ts'
import quilibriumDocs from '$/resolvers/QuilibriumDocs-Rest.ts'
import solanaSimds from '$/resolvers/SolanaSimds-Github.ts'
import zcashZips from '$/resolvers/ZcashZips-Github.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'

const dogecoinDipsQueries = vi.hoisted(() => ({
	getContents: vi.fn(),
	getMediaWikiText: vi.fn(),
}))

vi.mock('$/sources/DogecoinDips/Github/queries.ts', () => dogecoinDipsQueries)

const proposalResolvers = [
	[bitcoinBips, SpecificationRealm.Bitcoin, ProposalCategory.Bip],
	[bitcoinCashChips, SpecificationRealm.BitcoinCash, ProposalCategory.Chip],
	[caips, SpecificationRealm.ChainAgnostic, ProposalCategory.Caip],
	[cosmosAdrs, SpecificationRealm.Cosmos, ProposalCategory.Adr],
	[dogecoinDips, SpecificationRealm.Dogecoin, ProposalCategory.Dip],
	[ensips, SpecificationRealm.Ens, ProposalCategory.Ensip],
	[ethereumEips, SpecificationRealm.Ethereum, ProposalCategory.Eip],
	[ethereumEips, SpecificationRealm.Ethereum, ProposalCategory.Erc],
	[filecoinFips, SpecificationRealm.Filecoin, ProposalCategory.Fip],
	[hyperliquidDocs, SpecificationRealm.Hyperliquid, ProposalCategory.Hip],
	[litecoinLips, SpecificationRealm.Litecoin, ProposalCategory.Lip],
	[nearNeps, SpecificationRealm.Near, ProposalCategory.Nep],
	[polkadotRfcs, SpecificationRealm.Polkadot, ProposalCategory.Rfc],
	[quilibriumDocs, SpecificationRealm.Quilibrium, ProposalCategory.ProtocolDocument],
	[solanaSimds, SpecificationRealm.Solana, ProposalCategory.Simd],
	[zcashZips, SpecificationRealm.Zcash, ProposalCategory.Zip],
] as const

const sharedSpecificationProposalResolvers = [
	bitcoinBips,
	caips,
	cosmosAdrs,
	dogecoinDips,
	ensips,
	filecoinFips,
	hyperliquidDocs,
	litecoinLips,
	nearNeps,
	polkadotRfcs,
	solanaSimds,
	zcashZips,
] as const

describe('specification proposal source applicability', () => {
	it('preserves the shared proposal document and index resolver contract', () => {
		for (const module of sharedSpecificationProposalResolvers) {
			expect(module.resolvers).toHaveLength(2)
			expect(module.resolvers.map(({ entityType }) => entityType)).toEqual([
				EntityType.SpecificationProposal,
				EntityType._Global,
			])
			expect(Object.keys(module.resolvers[0].resolve)).toEqual([
				'RealmCategoryNumber',
			])
			expect(Object.keys(module.resolvers[0].projections)).toEqual([
				'documentBody',
				'documentCategory',
				'documentStatus',
				'documentTitle',
			])
			expect(Object.keys(module.resolvers[1].resolve)).toEqual([
				'Scope',
			])
			expect(Object.keys(module.resolvers[1].projections)).toEqual([
				'$$proposals',
			])
		}
	})

	it('discovers Dogecoin DIPs from the declared GitHub source snapshot', async () => {
		dogecoinDipsQueries.getContents.mockResolvedValueOnce([
			{
				type: 'file',
				name: 'dip-0070.mediawiki',
			},
			{
				type: 'file',
				name: 'dip-0100.mediawiki',
			},
			{
				type: 'dir',
				name: 'dip-0101.mediawiki',
			},
			{
				type: 'file',
				name: 'README.mediawiki',
			},
		])

		const rows = await dogecoinDips.resolvers[1]
			.resolve['Scope']
			.resolve()

		expect(dogecoinDipsQueries.getContents).toHaveBeenCalledOnce()
		expect(rows.map((row) => row[EntityMetaKey.Selector])).toEqual([
			{
				realm: SpecificationRealm.Dogecoin,
				category: ProposalCategory.Dip,
				number: 70,
			},
			{
				realm: SpecificationRealm.Dogecoin,
				category: ProposalCategory.Dip,
				number: 100,
			},
		])
	})

	it('admits only the provider that owns each realm and category before resolution', () => {
		const modules = [...new Set(proposalResolvers.map(([module]) => module))]
		const indexed = indexResolvers(
			schema,
			modules,
			new Set(modules.map(({ source }) => source))
		)
		const resolvers = indexed.resolverDefinitionsByEntityTypeAndSelectorName[
			resolverDefinitionsKey(
				EntityType.SpecificationProposal,
				'RealmCategoryNumber'
			)
		] ?? []

		for (const [module, realm, category] of proposalResolvers) {
			expect(
				resolvers
					.filter((resolver) => resolver.appliesTo(
						'RealmCategoryNumber',
						{
							realm,
							category,
							number: 1,
						}
					))
					.map(({ source }) => source)
			).toEqual([module.source])
		}
	})
})
