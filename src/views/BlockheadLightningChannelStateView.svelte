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
		{
			label: 'local node state',
		},
		{
			label: 'channel',
		},
		{
			label: 'private flag',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'local node state',
				},
				{
					label: 'channel',
				},
				{
					label: 'private flag',
				},
				{
					label: 'initiator flag',
				},
				{
					label: 'latest active state',
				},
				{
					label: 'latest local/remote/unsettled balances',
				},
				{
					label: 'latest commit fee/weight',
				},
				{
					label: 'latest fee per kw',
				},
				{
					label: 'latest update count',
				},
				{
					label: 'latest sync time',
				},
				{
					label: 'HTLC count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest local channel observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped local channel observations',
					},
				],
			},
			{
				label: 'Channel',
				items: [
					{
						label: 'public Lightning channel when graph identity resolves',
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
				label: 'HTLCs',
				items: [
					{
						label: 'local HTLC rows',
					},
				],
			},
			{
				label: 'Raw/local evidence',
				items: [
					{
						label: 'LND listchannels channel identity',
					},
					{
						label: 'privacy fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningChannelState>
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
	entityType={EntityType.BlockheadLightningChannelState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
