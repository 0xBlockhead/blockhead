export const beaconNodeIdentityBody = JSON.stringify({
	data: {
		peer_id: '16Uiu2HAmExample',
		enr: 'enr:-example',
		p2p_addresses: ['/ip4/127.0.0.1/tcp/9000/p2p/16Uiu2HAmExample'],
		discovery_addresses: ['/ip4/127.0.0.1/udp/9000/p2p/16Uiu2HAmExample'],
		metadata: { seq_number: '1', attnets: '0x0000000000000000', syncnets: '0x0f' },
	},
})

export const beaconSyncCommitteeBody = JSON.stringify({
	execution_optimistic: false,
	finalized: true,
	data: {
		validators: ['1'],
		validator_aggregates: [['1']],
	},
})

export const blockscoutTransactionLogsBody = (url: string) => {
	const transactionHash = decodeURIComponent(url).match(/\/transactions\/(0x[0-9a-fA-F]{64})\/logs(?:[/?#]|$)/)?.[1]
	if (transactionHash == null)
		throw new Error(`E2E fixture missing transaction hash in ${url}`)
	return JSON.stringify({
		items: [
			{
				address_hash: {
					hash: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				},
				block_number: 18_000_000,
				data: '0x',
				index: 0,
				topics: [
					'0x0000000000000000000000000000000000000000000000000000000000000000',
				],
				transaction_hash: transactionHash,
			},
		],
		next_page_params: null,
	})
}

const MOCK_BEACON_ROOT = `0x${'11'.repeat(32)}`
const MOCK_BEACON_SIGNATURE = `0x${'22'.repeat(96)}`
const MOCK_BEACON_HEADER_BODY = JSON.stringify({
	data: {
		root: MOCK_BEACON_ROOT,
		canonical: true,
		header: {
			message: {
				slot: '12345',
				proposer_index: '1',
				parent_root: MOCK_BEACON_ROOT,
				state_root: MOCK_BEACON_ROOT,
				body_root: MOCK_BEACON_ROOT,
			},
			signature: MOCK_BEACON_SIGNATURE,
		},
	},
})

const MOCK_BEACON_BLOCK_BODY = JSON.stringify({
	data: {
		message: {
			body: {
				attestations: [
					{
						aggregation_bits: '0x01',
						data: {
							index: '0',
						},
					},
				],
				proposer_slashings: [
					{},
				],
				attester_slashings: [],
				execution_payload: {
					withdrawals: [
						{
							index: '0',
							validator_index: '1',
							address: '0x0000000000000000000000000000000000000001',
							amount: '32000000000',
						},
					],
				},
			},
		},
	},
})

export const beaconRestBody = (url: string) => (
	url.includes('/eth/v1/node/health') ?
		''
	:
	url.includes('/eth/v1/node/version') ?
		JSON.stringify({ data: { version: 'Lighthouse/v5.3.0/e2e-fixture' } })
	:
	url.includes('/eth/v1/node/syncing') ?
		JSON.stringify({ data: { head_slot: '12345', sync_distance: '0', is_syncing: false, is_optimistic: false, el_offline: false } })
	:
	url.includes('/eth/v1/config/spec') ?
		JSON.stringify({ data: { SECONDS_PER_SLOT: '12' } })
	:
	url.includes('/eth/v1/node/peer_count') ?
		JSON.stringify({ data: { disconnected: '2', connecting: '1', connected: '12', disconnecting: '0' } })
	:
	url.includes('/eth/v1/node/identity') ?
		beaconNodeIdentityBody
	:
	url.includes('/eth/v1/beacon/headers/') ?
		MOCK_BEACON_HEADER_BODY
	:
	url.includes('/eth/v2/beacon/blocks/') ?
		MOCK_BEACON_BLOCK_BODY
	:
	url.includes('/eth/v1/beacon/states/')
	&& url.includes('/committees') ?
		JSON.stringify({
			data: [
				{
					slot: '12345',
					index: '0',
					validators: ['1'],
				},
			],
		})
	:
	url.includes('/eth/v1/beacon/states/') && /\/sync_committees(?:[?#]|$)/.test(url) ?
		beaconSyncCommitteeBody
	:
	url.includes('/eth/v1/beacon/states/head/finality_checkpoints') ?
		JSON.stringify({
			data: {
				previous_justified: {
					epoch: '384',
					root: MOCK_BEACON_ROOT,
				},
				current_justified: {
					epoch: '385',
					root: MOCK_BEACON_ROOT,
				},
				finalized: {
					epoch: '383',
					root: MOCK_BEACON_ROOT,
				},
			},
		})
	:
	url.includes('/eth/v1/beacon/states/head/validators/') ?
		JSON.stringify({
			data: {
				balance: '32000000000',
				status: 'active_ongoing',
				validator: {
					pubkey: `0x${'33'.repeat(48)}`,
					effective_balance: '32000000000',
					slashed: false,
				},
			},
		})
	:
	url.includes('/eth/v1/beacon/genesis') ?
		JSON.stringify({
			data: {
				genesis_time: '1606824023',
				genesis_validators_root: MOCK_BEACON_ROOT,
				genesis_fork_version: '0x00000000',
			},
		})
	:
	url.includes('/eth/v1/config/fork_schedule') ?
		JSON.stringify({
			data: [
				{
					epoch: '0',
					previous_version: '0x00000000',
					current_version: '0x00000000',
				},
			],
		})
	:
		(() => { throw new Error(`Unsupported Beacon E2E fixture URL: ${url}`) })()
)
