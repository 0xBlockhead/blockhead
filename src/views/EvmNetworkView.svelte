<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'caip2',
		],
		content: {
			dl: [
				[
					'slug',
					'name',
					'caip2',
					'namespace',
					'environment',
					'iconUrl',
					'executionEndpoints',
					'consensusEndpoints',
					'shortName',
					'registryStatus',
					'peeringId',
					'slip44',
					'consensusProtocol',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'rpc urls',
					when: 'open',
					items: [
						'$$rpcUrls',
					],
				},
				{
					label: 'block explorer urls',
					when: 'open',
					items: [
						'$$blockExplorerUrls',
					],
				},
				{
					label: 'faucet urls',
					when: 'open',
					items: [
						'$$faucetUrls',
					],
				},
				{
					label: 'native assets',
					when: 'open',
					items: [
						'$$nativeAssets',
					],
				},
				{
					label: 'testnets',
					when: 'open',
					items: [
						'$$testnets',
					],
				},
				{
					label: 'sibling shard networks',
					when: 'open',
					items: [
						'$$siblingShardNetworks',
					],
				},
				{
					label: 'upgrades',
					when: 'open',
					items: [
						'$$upgrades',
					],
				},
				{
					label: 'execution upgrades',
					when: 'open',
					items: [
						'$$executionUpgrades',
					],
				},
				{
					label: 'consensus upgrades',
					when: 'open',
					items: [
						'$$consensusUpgrades',
					],
				},
				{
					label: 'bridges',
					when: 'open',
					items: [
						'$$bridges',
					],
				},
				{
					label: 'settled rollups',
					when: 'open',
					items: [
						'$$settledRollups',
					],
				},
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
				{
					label: 'blocks',
					when: 'open',
					items: [
						'$$blocks',
					],
				},
				{
					label: 'transactions',
					when: 'open',
					items: [
						'$$transactions',
					],
				},
				{
					label: 'contracts',
					when: 'open',
					items: [
						'$$contracts',
					],
				},
				{
					label: 'precompiles',
					when: 'open',
					items: [
						'$$precompiles',
					],
				},
				{
					label: 'blobs',
					when: 'open',
					items: [
						'$$blobs',
					],
				},
				{
					label: 'gas fee blocks',
					when: 'open',
					items: [
						'$$gasFeeBlocks',
					],
				},
				{
					label: 'gas estimate timestamps',
					when: 'open',
					items: [
						'$$gasEstimateTimestamps',
					],
				},
				{
					label: 'txpool timestamps',
					when: 'open',
					items: [
						'$$txpoolTimestamps',
					],
				},
				{
					label: 'erc20 token transfers',
					when: 'open',
					items: [
						'$$erc20TokenTransfers',
					],
				},
				{
					label: 'nft token transfers',
					when: 'open',
					items: [
						'$$nftTokenTransfers',
					],
				},
				{
					label: 'erc4337 smart accounts',
					when: 'open',
					items: [
						'$$erc4337SmartAccounts',
					],
				},
				{
					label: 'erc4337 bundlers',
					when: 'open',
					items: [
						'$$erc4337Bundlers',
					],
				},
				{
					label: 'erc4337 paymasters',
					when: 'open',
					items: [
						'$$erc4337Paymasters',
					],
				},
				{
					label: 'erc4337 account factories',
					when: 'open',
					items: [
						'$$erc4337AccountFactories',
					],
				},
				{
					label: 'user operations',
					when: 'open',
					items: [
						'$$userOperations',
					],
				},
				{
					label: 'beacon finality timestamps',
					when: 'open',
					items: [
						'$$beaconFinalityTimestamps',
					],
				},
				{
					label: 'beacon epochs',
					when: 'open',
					items: [
						'$$beaconEpochs',
					],
				},
				{
					label: 'beacon slots',
					when: 'open',
					items: [
						'$$beaconSlots',
					],
				},
				{
					label: 'beacon committees',
					when: 'open',
					items: [
						'$$beaconCommittees',
					],
				},
				{
					label: 'beacon sync committees',
					when: 'open',
					items: [
						'$$beaconSyncCommittees',
					],
				},
				{
					label: 'beacon attestations',
					when: 'open',
					items: [
						'$$beaconAttestations',
					],
				},
				{
					label: 'beacon withdrawals',
					when: 'open',
					items: [
						'$$beaconWithdrawals',
					],
				},
				{
					label: 'beacon slashings',
					when: 'open',
					items: [
						'$$beaconSlashings',
					],
				},
				{
					label: 'beacon validators',
					when: 'open',
					items: [
						'$$beaconValidators',
					],
				},
				{
					label: 'mev relays',
					when: 'open',
					items: [
						'$$mevRelays',
					],
				},
				{
					label: 'mev builders',
					when: 'open',
					items: [
						'$$mevBuilders',
					],
				},
				{
					label: 'mev proposer payload deliveredses',
					when: 'open',
					items: [
						'$$mevProposerPayloadDelivered',
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetwork>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.EvmNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
