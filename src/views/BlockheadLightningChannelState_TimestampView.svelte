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
		'$channelState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$channelState',
				'timestampMs',
				'source',
				'active',
				'localBalanceSats',
			],
			[
				'remoteBalanceSats',
				'unsettledBalanceSats',
				'commitFeeSats',
				'commitWeight',
				'feePerKw',
			],
			[
				{
					label: 'update count',
				},
				{
					label: 'last synced time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Channel state',
				items: [
					{
						label: 'parent local channel state',
					},
				],
			},
			{
				label: 'Channel',
				items: [
					{
						label: 'public Lightning channel when resolved',
					},
				],
			},
			{
				label: 'Local node',
				items: [
					{
						label: 'parent connected Lightning node state',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'local/remote/unsettled/commit accounting',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'LND listchannels or channel-balance payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningChannelState_Timestamp>
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
	entityType={EntityType.BlockheadLightningChannelState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
