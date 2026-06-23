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
				label: 'network',
			},
			{
				label: 'channel id',
			},
			{
				label: 'short channel id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'channel id',
					},
					{
						label: 'short channel id',
					},
					{
						label: 'node0',
					},
					{
						label: 'node1',
					},
					{
						label: 'funding outpoint',
					},
					{
						label: 'opening time',
					},
					{
						label: 'latest observed status/capacity/fee',
					},
					{
						label: 'local-state count when connected',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Nodes',
					items: [
						{
							label: 'node0 endpoint',
						},
						{
							label: 'node1 endpoint',
						},
					],
				},
				{
					label: 'Public observations',
					items: [
						{
							label: 'timestamped public graph/channel observations',
						},
					],
				},
				{
					label: 'Funding',
					items: [
						{
							label: 'funding transaction id/output index',
						},
						{
							label: 'opening time',
						},
					],
				},
				{
					label: 'Closing',
					items: [
						{
							label: 'latest observed closing transaction',
						},
						{
							label: 'fee',
						},
						{
							label: 'reason',
						},
						{
							label: 'closed time when present',
						},
					],
				},
				{
					label: 'Local channel state',
					items: [
						{
							label: 'BlockheadLightningChannelState rows with balances/private/active/HTLCs',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Lightning network',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'public graph',
						},
						{
							label: 'LND channel payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningChannel>
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
	entityType={EntityType.LightningChannel}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
