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
		'$localNodeState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$localNodeState',
				'timestampMs',
				'source',
				{
					label: 'chain sync',
				},
				{
					label: 'graph sync',
				},
			],
			[
				'blockHeight',
				{
					label: 'best header time',
				},
				'walletBalanceSats',
				'channelBalanceSats',
				'pendingChannelBalanceSats',
			],
			[
				'peerCount',
				'activeChannelCount',
				'inactiveChannelCount',
				'pendingChannelCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Local node',
				items: [
					{
						label: 'parent connected Lightning node state',
					},
				],
			},
			{
				label: 'Public node',
				items: [
					{
						label: 'public Lightning node when advertised',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'wallet/channel/pending balances',
					},
				],
			},
			{
				label: 'Graph sync',
				items: [
					{
						label: 'chain/graph sync',
					},
					{
						label: 'peer/channel counts',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'LND getinfo',
					},
					'walletBalanceSats',
					'channelBalanceSats',
					{
						label: 'pending channels',
					},
					{
						label: 'peers payloads',
					},
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningNodeState_Timestamp>
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
	entityType={EntityType.BlockheadLightningNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
