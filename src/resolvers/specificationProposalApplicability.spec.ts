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
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'

const bitcoinCashChipsQueries = vi.hoisted(() => ({
	getChipMarkdownText: vi.fn(),
	getTree: vi.fn(),
}))
const bitcoinBipsQueries = vi.hoisted(() => ({
	getProposalFiles: vi.fn(),
	getProposalText: vi.fn(),
}))
const dogecoinDipsQueries = vi.hoisted(() => ({
	getContents: vi.fn(),
	getMediaWikiText: vi.fn(),
}))

vi.mock('$/sources/BitcoinCashChips/Gitlab/queries.ts', () => bitcoinCashChipsQueries)
vi.mock('$/sources/BitcoinBips/Github/queries.ts', () => bitcoinBipsQueries)
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

describe('specification proposal source applicability', () => {
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

	it('discovers Bitcoin BIPs through the source-owned repository query', async () => {
		bitcoinBipsQueries.getProposalFiles.mockResolvedValueOnce([
			{
				number: 9,
				path: 'bip-0009.mediawiki',
			},
		])

		const rows = await bitcoinBips.resolvers[1].resolve.Scope.resolve()

		expect(bitcoinBipsQueries.getProposalFiles).toHaveBeenCalledWith()
		expect(rows.map((row) => row[EntityMetaKey.Selector])).toEqual([
			{
				realm: SpecificationRealm.Bitcoin,
				category: ProposalCategory.Bip,
				number: 9,
			},
		])
	})

	it('discovers and resolves Bitcoin Cash CHIPs through the provider-owned repository contract', async () => {
		const tree = [
			{
				type: 'blob',
				name: 'CHIP-2021-05-new.md',
				path: 'CHIP-2021-05-new.md',
			},
			{
				type: 'tree',
				name: 'CHIP-2020-01-directory.md',
				path: 'CHIP-2020-01-directory.md',
			},
			{
				type: 'blob',
				name: 'CHIP-2020-01-old.md',
				path: 'CHIP-2020-01-old.md',
			},
		]
		bitcoinCashChipsQueries.getTree.mockResolvedValue(tree)

		const rows = await bitcoinCashChips.resolvers[1].resolve.Scope.resolve()
		expect(rows.map((row) => row[EntityMetaKey.Selector])).toEqual([
			{
				realm: SpecificationRealm.BitcoinCash,
				category: ProposalCategory.Chip,
				number: 202001001,
			},
			{
				realm: SpecificationRealm.BitcoinCash,
				category: ProposalCategory.Chip,
				number: 202105002,
			},
		])

		bitcoinCashChipsQueries.getChipMarkdownText.mockResolvedValue(`> Type: Standards\n> Status: Draft\n# Fallback title\n\nBody`)
		const proposal = await bitcoinCashChips.resolvers[0]
			.resolve.RealmCategoryNumber.resolve({
				realm: SpecificationRealm.BitcoinCash,
				category: ProposalCategory.Chip,
				number: 202105002,
			})
		expect(bitcoinCashChipsQueries.getChipMarkdownText).toHaveBeenCalledWith({
			path: 'CHIP-2021-05-new.md',
		})
		expect(proposal).toEqual({
			documentBody: `> Type: Standards\n> Status: Draft\n# Fallback title\n\nBody`,
			documentCategory: 'Standards',
			documentStatus: 'Draft',
			documentTitle: 'Fallback title',
		})
	})

	it('preserves Quilibrium proposal fields on the global index rows', async () => {
		const rows = await quilibriumDocs.resolvers[1].resolve.Scope.resolve()
		expect(rows).toHaveLength(1)
		expect(rows[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentBody')]: 'Quilibrium protocol whitepaper and architecture reference.',
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')]: 'Protocol document',
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')]: 'Published',
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')]: 'Quilibrium peer-to-peer MPC platform whitepaper',
		})
	})

	it('preserves Hyperliquid HIP titles on the global index rows', async () => {
		const rows = await hyperliquidDocs.resolvers[1].resolve.Scope.resolve()
		expect(rows[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentCategory')]: 'HIP',
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentStatus')]: 'Documented',
			[entityFieldAddressKey(EntityType.SpecificationProposal, [], 'documentTitle')]: 'Native token standard and spot deploys',
		})
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
