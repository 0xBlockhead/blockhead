import { beforeEach, describe, expect, it, vi } from 'vitest'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: {
		endpoints: {
			locator: string
		}[]
	}) => (
		binding.endpoints[0].locator.includes('asset-hub') ?
			'http://127.0.0.1:8081'
		:
			'http://127.0.0.1:8080'
	),
	sourceFetch,
	sourceGetJson: async (_binding: unknown, url: string) => {
		const response = await sourceFetch(_binding, url)
		return response.json()
	},
	sourceGetText: vi.fn(),
}))

const {
	getAccountAssetBalances,
	getAccountBalanceInfo,
	getAccountForeignAssetBalances,
	getAccountStakingInfo,
	getAhmInfo,
	getAssetInfo,
	getBlock,
	getBlockExtrinsic,
	getBlockHead,
	getBlockHeadHeader,
	getBlocks,
	getForeignAssetInfo,
	getForeignAssets,
	getNodeNetwork,
	getNodeVersion,
	getOngoingReferenda,
	getRcOngoingReferenda,
	getRcStakingValidators,
	getRuntimeMetadata,
	getRuntimeSpec,
	getStakingValidators,
	getTransactionMaterial,
	polkadotAssetHubSidecarBinding,
} = await import('$/sources/SubstrateSidecar/Rest/queries.ts')

const balanceInfo = {
	at: {
		hash: '0xFINALIZED_BLOCK_HASH',
		height: '20000000',
	},
	nonce: '9007199254740993',
	tokenSymbol: 'DOT',
	free: '123456789012345678901234',
	reserved: '0',
	frozen: '0',
	transferable: '123456789012345678901234',
	locks: [],
}

const block = {
	number: '32440766',
	hash: '0xBLOCK_HASH',
	parentHash: '0xPARENT_HASH',
	stateRoot: '0xSTATE_ROOT',
	extrinsicsRoot: '0xEXTRINSICS_ROOT',
	authorId: '16QuK5qdXsb7BdJ47p7r73RmyUAMpi27T2LnnkGa7xezUSDm',
	extrinsics: [
		{
			method: {
				pallet: 'timestamp',
				method: 'set',
			},
			signature: null,
			hash: '0xEXTRINSIC_HASH',
			events: [
				{
					method: {
						pallet: 'system',
						method: 'ExtrinsicSuccess',
					},
					data: [],
				},
			],
			success: true,
		},
	],
}

describe('Substrate Sidecar query envelopes', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('fail-closes account balance info and preserves decimal strings', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(balanceInfo)))
		await expect(getAccountBalanceInfo({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).resolves.toMatchObject({
			nonce: '9007199254740993',
			free: '123456789012345678901234',
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...balanceInfo,
			free: '-1',
		})))
		await expect(getAccountBalanceInfo({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).rejects.toThrow('invalid account balance info response envelope')
	})

	it('accepts live block/event object method shapes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(block)))
		await expect(getBlock({
			blockId: block.hash,
		})).resolves.toMatchObject({
			number: '32440766',
			extrinsics: [
				{
					method: {
						pallet: 'timestamp',
						method: 'set',
					},
					events: [
						{
							method: {
								pallet: 'system',
								method: 'ExtrinsicSuccess',
							},
						},
					],
				},
			],
		})
		expect(sourceFetch.mock.calls[0][1]).toBe(`http://127.0.0.1:8080/blocks/${block.hash}`)
	})

	it('fail-closes malformed blocks and rejects empty account ids', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...block,
			number: '-1',
		})))
		await expect(getBlock({
			blockId: 1n,
		})).rejects.toThrow('invalid block response envelope')

		await expect(getAccountBalanceInfo({
			accountId: '',
		})).rejects.toThrow('account ID must not be empty')
		expect(sourceFetch).toHaveBeenCalledTimes(1)
	})

	it('reads finalized head and asset-balance envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(block)))
		await expect(getBlockHead()).resolves.toMatchObject({
			hash: block.hash,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks/head?finalized=true')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assets: [
				{
					assetId: '100',
					balance: '42',
					isFrozen: false,
					isSufficient: true,
				},
			],
		})))
		await expect(getAccountAssetBalances({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).resolves.toMatchObject({
			assets: [
				{
					assetId: '100',
					balance: '42',
				},
			],
		})
	})

	it('normalizes v14 runtime metadata pallets and fails closed on missing pallets', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			magicNumber: 1635018093,
			metadata: {
				v14: {
					pallets: [
						{
							name: 'System',
							index: '0',
						},
						{
							name: 'Staking',
							index: 7,
						},
					],
				},
			},
		})))
		await expect(getRuntimeMetadata()).resolves.toEqual({
			pallets: [
				{
					name: 'System',
					index: '0',
				},
				{
					name: 'Staking',
					index: 7,
				},
			],
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			magicNumber: 1,
			metadata: {
				v14: {},
			},
		})))
		await expect(getRuntimeMetadata()).rejects.toThrow('invalid runtime metadata response envelope')
	})

	it('fail-closes staking validators envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			validators: [
				{
					accountId: '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq',
					totalStake: '1000',
				},
			],
		})))
		await expect(getStakingValidators()).resolves.toMatchObject({
			validators: [
				{
					accountId: '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq',
				},
			],
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			validators: [
				{
					accountId: '',
				},
			],
		})))
		await expect(getStakingValidators()).rejects.toThrow('invalid staking validators response envelope')
	})

	it('reads runtime spec + node version and fail-closes malformed specs', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xRUNTIME_HASH',
				height: '32440766',
			},
			specName: 'polkadot',
			implName: 'parity-polkadot',
			authoringVersion: '0',
			specVersion: '1007001',
			implVersion: 0,
			transactionVersion: 26,
			stateVersion: '1',
		})))
		await expect(getRuntimeSpec()).resolves.toEqual({
			at: {
				hash: '0xRUNTIME_HASH',
				height: '32440766',
			},
			specName: 'polkadot',
			implName: 'parity-polkadot',
			authoringVersion: 0,
			specVersion: 1007001,
			implVersion: 0,
			transactionVersion: 26,
			stateVersion: 1,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/runtime')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			clientVersion: '0.17.0',
			clientImplName: 'substrate-api-sidecar',
			chain: 'Polkadot',
		})))
		await expect(getNodeVersion()).resolves.toMatchObject({
			clientVersion: '0.17.0',
			chain: 'Polkadot',
		})
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/node/version')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xRUNTIME_HASH',
				height: '32440766',
			},
			specName: '',
			authoringVersion: 0,
			specVersion: 1,
		})))
		await expect(getRuntimeSpec()).rejects.toThrow('invalid runtime spec response envelope')
	})

	it('routes asset-balance transport through an override binding for Asset Hub prep', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assets: [
				{
					assetId: 1984,
					balance: '7',
				},
			],
		})))
		await expect(getAccountAssetBalances({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
			binding: polkadotAssetHubSidecarBinding,
		})).resolves.toMatchObject({
			assets: [
				{
					assetId: 1984,
					balance: '7',
				},
			],
		})
		expect(sourceFetch.mock.calls[0][1]).toBe(
			'http://127.0.0.1:8081/accounts/13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB/asset-balances'
		)
	})

	it('accepts live Asset Hub isFrozen capability strings and optional asset filters', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assets: [
				{
					assetId: '1984',
					balance: '3790709913555',
					isFrozen: 'isFrozen does not exist for this runtime',
					isSufficient: true,
				},
			],
		})))
		await expect(getAccountAssetBalances({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
			at: 19_148_225n,
			assets: [
				1984,
				1337,
			],
		})).resolves.toEqual({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assets: [
				{
					assetId: '1984',
					balance: '3790709913555',
					isSufficient: true,
				},
			],
		})
		expect(sourceFetch.mock.calls[0][1]).toBe(
			'http://127.0.0.1:8080/accounts/13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB/asset-balances?at=19148225&assets%5B%5D=1984&assets%5B%5D=1337'
		)
	})

	it('reads block range / head header / singular extrinsic envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify([
			{
				...block,
				number: '9',
				hash: '0xPARENT_HASH',
			},
			block,
		])))
		await expect(getBlocks({
			from: 9n,
			to: 10n,
		})).resolves.toHaveLength(2)
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/blocks?range=9-10')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			number: block.number,
			parentHash: block.parentHash,
			stateRoot: block.stateRoot,
			extrinsicsRoot: block.extrinsicsRoot,
			digest: {
				logs: [],
			},
		})))
		await expect(getBlockHeadHeader()).resolves.toMatchObject({
			number: block.number,
		})
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/blocks/head/header?finalized=true')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: block.hash,
				height: block.number,
			},
			extrinsics: block.extrinsics[0],
		})))
		await expect(getBlockExtrinsic({
			blockId: block.hash,
			extrinsicIndex: 0,
		})).resolves.toMatchObject({
			extrinsic: {
				hash: '0xEXTRINSIC_HASH',
			},
		})
		expect(sourceFetch.mock.calls[2][1]).toBe(`http://127.0.0.1:8080/blocks/${block.hash}/extrinsics/0`)

		await expect(getBlocks({
			from: 11n,
			to: 10n,
		})).rejects.toThrow('invalid block range')
	})

	it('decodes Asset Hub asset-info metadata and foreign balances', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assetInfo: {
				owner: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
				issuer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
				admin: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
				freezer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
				supply: '77998622058218',
				deposit: '1000000000000',
				minBalance: '10000',
				isSufficient: true,
				accounts: '13853',
				sufficients: '13749',
				approvals: '22',
				status: 'Live',
			},
			assetMetaData: {
				deposit: '2008200000',
				name: '0x54657468657220555344',
				symbol: '0x55534474',
				decimals: '6',
				isFrozen: false,
			},
		})))
		await expect(getAssetInfo({
			assetId: 1984,
		})).resolves.toMatchObject({
			name: 'Tether USD',
			symbol: 'USDt',
			decimals: 6,
			supply: '77998622058218',
			status: 'Live',
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/pallets/assets/1984/asset-info')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			foreignAssets: [
				{
					multiLocation: {
						parents: '1',
						interior: {
							x1: [
								{
									parachain: '3369',
								},
							],
						},
					},
					balance: '2999978886176645548557674',
					isFrozen: false,
					isSufficient: false,
				},
			],
		})))
		await expect(getAccountForeignAssetBalances({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).resolves.toMatchObject({
			foreignAssets: [
				{
					balance: '2999978886176645548557674',
					isFrozen: false,
				},
			],
		})

		const foreignMultiLocation = {
			parents: '1',
			interior: {
				x1: [
					{
						parachain: '3369',
					},
				],
			},
		}
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_FOREIGN_HASH',
				height: '19148226',
			},
			items: [
				{
					multiLocation: foreignMultiLocation,
					foreignAssetInfo: {
						owner: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
						issuer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
						admin: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
						freezer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
						supply: '77998622058218',
						deposit: '1000000000000',
						minBalance: '10000',
						isSufficient: true,
						accounts: '13853',
						sufficients: '13749',
						approvals: '22',
						status: 'Live',
					},
					foreignAssetMetadata: {
						deposit: '2008200000',
						name: '0x54657468657220555344',
						symbol: '0x55534474',
						decimals: '6',
						isFrozen: false,
					},
				},
			],
		})))
		await expect(getForeignAssetInfo({
			assetId: JSON.stringify(foreignMultiLocation),
			binding: polkadotAssetHubSidecarBinding,
		})).resolves.toMatchObject({
			name: 'Tether USD',
			symbol: 'USDt',
			decimals: 6,
			supply: '77998622058218',
		})
		expect(sourceFetch.mock.calls[2][1]).toBe(
			'http://127.0.0.1:8081/pallets/foreign-assets'
		)
	})

	it('fail-closes Asset Hub asset-balance / asset-info / foreign-balance envelopes', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assets: [
				{
					assetId: '1984',
					balance: '-1',
				},
			],
		})))
		await expect(getAccountAssetBalances({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).rejects.toThrow('invalid account asset balances response envelope')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			assetInfo: {
				owner: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
				issuer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
				admin: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
				freezer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
				supply: '1',
				deposit: '1',
				minBalance: '1',
				isSufficient: true,
				accounts: '1',
				sufficients: '1',
				approvals: '0',
				status: 'Live',
			},
			assetMetaData: {
				deposit: '1',
				name: 'not-hex',
				symbol: '0x55534474',
				decimals: 6,
				isFrozen: false,
			},
		})))
		await expect(getAssetInfo({
			assetId: 1984,
		})).rejects.toThrow('malformed asset metadata hex')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '',
				height: '19148225',
			},
			foreignAssets: [],
		})))
		await expect(getAccountForeignAssetBalances({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})).rejects.toThrow('invalid account foreign asset balances response envelope')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xAH_HASH',
				height: '19148225',
			},
			items: [
				{
					multiLocation: {
						parents: '1',
					},
					foreignAssetInfo: {
						owner: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
						issuer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
						admin: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
						freezer: '15uPcYeUE2XaMiMJuR6W7QGW2LsLdKXX7F3PxKG8gcizPh3X',
						supply: '1',
						deposit: '1',
						minBalance: '1',
						isSufficient: true,
						accounts: '1',
						sufficients: '1',
						approvals: '0',
						status: 'Live',
					},
					foreignAssetMetadata: {
						deposit: '1',
						name: 'not-hex',
						symbol: '0x55534474',
						decimals: 6,
						isFrozen: false,
					},
				},
			],
		})))
		await expect(getForeignAssets()).rejects.toThrow('malformed asset metadata hex')
	})

	it('reads AHM info and RC staking validator path for Asset Hub prep', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			relay: {
				startBlock: '28490502',
				endBlock: '28495696',
			},
			assetHub: {
				startBlock: '10254470',
				endBlock: '10259208',
			},
		})))
		await expect(getAhmInfo()).resolves.toMatchObject({
			relay: {
				startBlock: '28490502',
			},
			assetHub: {
				endBlock: '10259208',
			},
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/ahm-info')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			validators: [
				{
					accountId: '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq',
				},
			],
		})))
		await expect(getRcStakingValidators()).resolves.toMatchObject({
			validators: [
				{
					accountId: '15oF4uVJwmo4qjQJeHCDruaKdS2nG6t6dD6rJ8X2vY8rKzq',
				},
			],
		})
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/rc/pallets/staking/validators')
	})

	it('accepts live node/network envelopes with object roles and string peersInfo errors', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			nodeRoles: [
				{
					full: null,
				},
			],
			numPeers: '91',
			isSyncing: false,
			shouldHavePeers: true,
			localPeerId: '12D3KooWKJGb7Z25jKUsMzWSEmDSXkUBhSxXsxWdDpnzDMPDLgZ1',
			localListenAddresses: [
				'/ip4/127.0.0.1/tcp/30333',
			],
			peersInfo: 'Cannot query system_peers from node.',
		})))
		await expect(getNodeNetwork()).resolves.toMatchObject({
			numPeers: '91',
			isSyncing: false,
			shouldHavePeers: true,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('http://127.0.0.1:8080/node/network')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			numPeers: 'not-a-number',
			isSyncing: false,
			shouldHavePeers: true,
		})))
		await expect(getNodeNetwork()).rejects.toThrow('invalid node network response envelope')
	})

	it('fail-closes staking-info / referenda / transaction material leftovers', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xSTASH_AT',
				height: '32440000',
			},
			rewardDestination: 'Staked',
			controller: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
			numSlashingSpans: null,
			staking: {
				stash: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
			},
		})))
		await expect(getAccountStakingInfo({
			accountId: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
			at: 32_440_000n,
		})).resolves.toMatchObject({
			rewardDestination: 'Staked',
			controller: '13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB',
		})
		expect(sourceFetch.mock.calls[0][1]).toBe(
			'http://127.0.0.1:8080/accounts/13UVJyLnbVp9RBZYFwFGyDvVd1y27Tt8tkntv6Q7JVPhFsTB/staking-info?at=32440000'
		)

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xREF_AT',
				height: '32442435',
			},
			referenda: [
				{
					id: 1284,
					submitted: '32440000',
					deciding: {
						since: '32441000',
						confirming: null,
					},
				},
			],
		})))
		await expect(getOngoingReferenda()).resolves.toEqual({
			at: {
				hash: '0xREF_AT',
				height: '32442435',
			},
			referenda: [
				{
					id: '1284',
					submitted: '32440000',
					deciding: {
						since: '32441000',
						confirming: null,
					},
				},
			],
		})
		expect(sourceFetch.mock.calls[1][1]).toBe('http://127.0.0.1:8080/pallets/on-going-referenda')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xREF_AT',
				height: '32442435',
			},
			referenda: [],
		})))
		await expect(getRcOngoingReferenda({
			at: '0xREF_AT',
		})).resolves.toMatchObject({
			referenda: [],
		})
		expect(sourceFetch.mock.calls[2][1]).toBe('http://127.0.0.1:8080/rc/pallets/on-going-referenda?at=0xREF_AT')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xMATERIAL',
				height: '32442438',
			},
			genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
			chainName: 'Polkadot',
			specName: 'polkadot',
			specVersion: 2003002,
			txVersion: 26,
		})))
		await expect(getTransactionMaterial()).resolves.toEqual({
			at: {
				hash: '0xMATERIAL',
				height: '32442438',
			},
			genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
			chainName: 'Polkadot',
			specName: 'polkadot',
			specVersion: '2003002',
			txVersion: '26',
		})
		expect(sourceFetch.mock.calls[3][1]).toBe('http://127.0.0.1:8080/transaction/material')

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			at: {
				hash: '0xMATERIAL',
				height: '32442438',
			},
			genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
			chainName: '',
			specName: 'polkadot',
			specVersion: '1',
			txVersion: '1',
		})))
		await expect(getTransactionMaterial()).rejects.toThrow('invalid transaction material response envelope')
	})
})
