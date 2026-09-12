import { describe, expect, test, vi } from 'vitest'

import { admitResolverFixtures } from './_fixtureAuthority.ts'
import {
	representativeIdentityFixtures,
	representativeIdentityProvenance,
} from './_representativeIdentities.ts'

const probe = (
	selectorName: string,
	appliesTo: (selectorName: string, selector: { id: string }) => boolean
) => ({
	entityType: 'Thing',
	selectorName,
	source: 'Fixture',
	affectedCaseCount: 1,
	appliesTo,
})
describe('resolver fixture admission', () => {
	test('partitions applicable, inapplicable, and missing identities without provider execution', async () => {
		const applicable = vi.fn(() => true)
		const inapplicable = vi.fn(() => false)
		const admissions = await admitResolverFixtures([
			probe('Applicable', applicable),
			probe('Inapplicable', inapplicable),
			probe('Missing', () => {
				throw new Error('applicability must not run without an identity')
			}),
		], ({ selectorName }) => {
			if (selectorName === 'Missing')
				throw new Error('no canonical fixture')

			return { id: selectorName }
		})

		expect(admissions.map(({ kind }) => kind)).toEqual([
			'Applicable',
			'Inapplicable',
			'Missing',
		])
		expect(applicable).toHaveBeenCalledWith('Applicable', { id: 'Applicable' })
		expect(inapplicable).toHaveBeenCalledWith('Inapplicable', { id: 'Inapplicable' })
		expect(admissions[2]).toMatchObject({
			kind: 'Missing',
			error: 'no canonical fixture',
		})
	})

	test('resolves a shared identity once per source-specific coordinate', async () => {
		const resolveFixture = vi.fn(() => ({ id: 'canonical' }))
		const admissions = await admitResolverFixtures([
			probe('ById', () => true),
			{ ...probe('ById', () => true), source: 'Other' },
		], resolveFixture)

		expect(admissions).toHaveLength(2)
		expect(resolveFixture).toHaveBeenCalledTimes(2)
	})

	test('anchors the admitted Chainlink feed and Hedera node to exact source identities', () => {
		expect(representativeIdentityFixtures.chainlink.ethUsdFeed).toEqual({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			address: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
		})
		expect(representativeIdentityProvenance.chainlinkEthUsdFeed).toMatchObject({
			owner: 'Chainlink Data Feeds address catalog',
			authority: 'https://docs.chain.link/data-feeds/price-feeds/addresses',
		})
		expect(representativeIdentityFixtures.hedera.mainnetNodeZero).toEqual({
			$network: { slug: 'hedera' },
			nodeId: 0,
		})
		expect(representativeIdentityProvenance.hederaMainnetNodeZero).toMatchObject({
			owner: 'Hedera Mirror Node REST API',
			authority: 'https://docs.hedera.com/api-reference/network/get-the-network-address-book-nodes',
			canonicalInput: 'GET /api/v1/network/nodes?limit=1&order=asc&node.id=eq:0 (account 0.0.3)',
		})
	})

	test('keeps source-backed identity provenance beside the shared fixture', () => {
		expect(representativeIdentityFixtures.cosmosHubIbc).toMatchObject({
			channelId: 'channel-0',
			packetSequence: 1n,
			connectionId: 'connection-5',
			clientId: '07-tendermint-5',
		})
		expect(representativeIdentityProvenance.cosmosHubIbc).toMatchObject({
			owner: 'Cosmos Hub public RPC and Cosmos Directory REST',
			authority: 'https://cosmos-rpc.publicnode.com/',
			canonicalInput: 'Cosmos Hub block 32823347/hash 598DCFEB… plus transfer/channel-0, packet commitment 1, linked connection-5 and client 07-tendermint-5 queried on 2026-09-04; trace key follows the resolver-owned ICS-20 path identity',
		})
		expect(representativeIdentityFixtures.filfox).toMatchObject({
			messageHeight: 6_342_004n,
			dealId: 133_977_726n,
		})
		expect(representativeIdentityProvenance.filfoxMainnet).toMatchObject({
			owner: 'Filfox Filecoin explorer API',
			authority: 'https://filfox.info/',
		})
		expect(representativeIdentityProvenance.lotusGlifMainnet).toMatchObject({
			owner: 'GLIF Filecoin Lotus API',
			authority: 'https://api.node.glif.io/rpc/v1',
		})
		expect(representativeIdentityFixtures.arweave).toMatchObject({
			blockHeight: 1_994_309n,
			manifestTransactionId: 'nRjadfC8nNqyQNDMVubUyGZYmHRVxKmCZwOstgDf_1g',
			manifestPath: 'token.json',
		})
		expect(representativeIdentityProvenance.arweaveGatewayMainnet).toMatchObject({
			owner: 'Arweave public gateway',
			authority: 'https://arweave.net/',
		})
		expect(representativeIdentityFixtures.algorand).toMatchObject({
			proofTransactionId: 'ITSPM2FFCGCNBPQUEWBK5IGFWEEPTIZC3BDU5HIWS575CUFH6OUA',
			proofRound: 64_739_000n,
			transactionGroup: '0x35dd1589f92da2e464db49979c5da80a7712dbbb6cdd4bea95b59c98ea39f06b',
		})
		expect(representativeIdentityProvenance.algorandNodelyMainnet).toMatchObject({
			owner: 'Nodely Algorand Indexer',
			authority: 'https://mainnet-idx.4160.nodely.dev/',
		})
		expect(representativeIdentityFixtures.avalanche).toMatchObject({
			pChainBlockHeight: 1n,
			pChainBlockId: '4AqeFPxtTW4B5D6oR8gRZTvRKnnqkUWiV6mUNZxjUMbQKYWpi',
			validatorNodeId: 'NodeID-6QD1KNQkx6wj142Tv6demd3FYbghQvCM2',
		})
		expect(representativeIdentityProvenance.avalanchePlatformVmMainnet).toMatchObject({
			owner: 'Avalanche public PlatformVM API',
			authority: 'https://api.avax.network/ext/bc/P',
		})
		expect(representativeIdentityFixtures.lens).toMatchObject({
			usernameId: '970704',
			usernameLocalName: 'forexai',
			namespaceAddress: '0x772c653b2383455fefbb15e7c283b2ff61c63e57',
		})
		expect(representativeIdentityProvenance.lensCurrentDirectory).toMatchObject({
			owner: 'Lens GraphQL API',
			authority: 'https://api.lens.xyz/graphql',
		})
		expect(representativeIdentityFixtures.gitlab).toEqual({
			projectMirror: {
				forgeHost: 'gitlab.com',
				owner: 'gitlab-org',
				repositoryName: 'gitlab',
			},
			projectRepository: {
				canonicalRemoteUrl: 'https://gitlab.com/gitlab-org/gitlab.git',
			},
			pipelineId: 2_821_815_848,
			jobId: 16_319_415_986,
			issueNumber: 627_806,
			pullRequestNumber: 253_788,
			protectedBranchName: 'master',
			compareFromObjectId: '0x346d3c57ccfb18d3ce413fdedf7e8bbc03e913dd',
			compareToObjectId: '0x38b1f5973f1da60a765815acc819c36c7c36e308',
			compareFilePath: 'doc/auth/tokens/fine_grained_access_tokens_rest.md',
			signatureId: 'https://gitlab.com/gitlab-org/gitlab/-/commit/38b1f5973f1da60a765815acc819c36c7c36e308#signature',
		})
		expect(representativeIdentityProvenance.gitlabProject).toMatchObject({
			owner: 'GitLab',
			authority: 'https://gitlab.com/gitlab-org/gitlab',
		})
		expect(representativeIdentityFixtures.kaspaExplorer).toMatchObject({
			transactionId: 'a249926881cda5f3199bf1cd3662cc6f2c3c0c713df1f9c069ff95533b48562c',
			acceptingBlockHash: '22331055f6af40fd0a51df2da53f92742b88917b18a6b08acffbd5a1bcb9e945',
		})
		expect(representativeIdentityProvenance.kaspaExplorerMainnet).toMatchObject({
			owner: 'Kaspa public Explorer API',
			authority: 'https://api.kaspa.org/',
		})
		expect(representativeIdentityFixtures.tezos).toMatchObject({
			headLevel: 14_805_148n,
			bakerAddress: 'tz3RDC3Jdn4j15J7bBHZd29EUee9gVB1CxD9',
			contractAddress: 'KT1VwgAzxBMuxWdWdFCZoGAfSJ8YTtTq4UBV',
			tokenId: 3n,
		})
		expect(representativeIdentityProvenance.tzktMainnet).toMatchObject({
			owner: 'TzKT Tezos indexer',
			authority: 'https://api.tzkt.io/',
		})
		expect(representativeIdentityFixtures.hedera).toMatchObject({
			contractResultTransactionId: '0.0.995584-1788565540-759489405',
			topicId: '0.0.10614381',
			topicMessageSequenceNumber: 1n,
			tokenTreasuryAccountId: '0.0.10835800',
		})
		expect(representativeIdentityFixtures.internetComputer).toMatchObject({
			ledgerCanisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
			blockIndex: 9_840_566n,
			transactionIndex: 0,
		})
		expect(representativeIdentityProvenance.internetComputerRosettaMainnet).toMatchObject({
			owner: 'DFINITY Internet Computer developer documentation',
			authority: 'https://docs.internetcomputer.org/guides/digital-assets/rosetta/',
		})
		expect(representativeIdentityFixtures.beacon).toMatchObject({
			slot: 15_145_036,
			validatorIndex: 830_776,
		})
		expect(representativeIdentityProvenance.beaconMainnetPublicNode).toMatchObject({
			owner: 'Ethereum Beacon API PublicNode',
			authority: 'https://ethereum-beacon-api.publicnode.com/',
		})
		expect(representativeIdentityFixtures.osmosis).toMatchObject({
			poolId: '1',
			positionId: '12',
			channelId: 'channel-0',
			connectionId: 'connection-0',
			clientId: '07-tendermint-0',
		})
		expect(representativeIdentityProvenance.osmosisMainnetLcd).toMatchObject({
			owner: 'Osmosis LCD',
			authority: 'https://lcd.osmosis.zone/',
		})
		expect(representativeIdentityFixtures.sui).toMatchObject({
			transactionCheckpointSequence: 318_800_406n,
			transactionDigest: '8AupcYSAsSoqa1ZbtsPjdfko7aLsRnbpJhBWKpLTr1WZ',
			packageId: '0x0000000000000000000000000000000000000000000000000000000000000002',
			packageVersion: 59n,
			moduleName: 'sui',
			functionName: 'transfer',
			structName: 'SUI',
		})
		expect(representativeIdentityProvenance.suiMainnetGraphql).toMatchObject({
			owner: 'Mysten Labs Sui GraphQL',
			authority: 'https://graphql.mainnet.sui.io/graphql',
		})
		expect(representativeIdentityFixtures.xrpl).toMatchObject({
			ledgerIndex: 106_766_487n,
			trustlineCurrency: 'USD',
			amendmentId: '8CC0774A3BF66D1D22E76BBDA8E8A232E6B6313834301B3B23E8601196AE6455',
			ammAccount: 'rs9ineLqrCzeAGS1bxsrW8x2n3bRJYAh3Q',
		})
		expect(representativeIdentityProvenance.xrplMainnetRippled).toMatchObject({
			owner: 'XRPL Foundation public rippled/Clio service and XRPScan',
			authority: 'https://s1.ripple.com:51234',
		})
	})
})
