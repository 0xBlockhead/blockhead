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
		'$channel',
		'htlcIndex',
	],
	content: {
		dl: [
			[
				'$channelState',
				'$channel',
				'htlcIndex',
				'direction',
				'amountMsat',
			],
			[
				'expiryHeight',
				'hashLock',
				'state',
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
						label: 'connected Lightning node through channel state',
					},
				],
			},
			{
				label: 'Timing',
				items: [
					'expiryHeight',
					{
						label: 'local state',
					},
				],
			},
			{
				label: 'Payment hash',
				items: [
					{
						label: 'hash lock display',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'LND pending_htlcs payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningHtlc>
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
	entityType={EntityType.BlockheadLightningHtlc}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
