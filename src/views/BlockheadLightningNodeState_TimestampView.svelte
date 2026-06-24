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
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'local node state',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'chain sync',
				},
				{
					label: 'graph sync',
				},
				{
					label: 'block height',
				},
				{
					label: 'best header time',
				},
				{
					label: 'wallet balance',
				},
				{
					label: 'channel balance',
				},
				{
					label: 'pending channel balance',
				},
				{
					label: 'peer count',
				},
				{
					label: 'active channel count',
				},
				{
					label: 'inactive channel count',
				},
				{
					label: 'pending channel count',
				},
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
					{
						label: 'wallet balance',
					},
					{
						label: 'channel balance',
					},
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
