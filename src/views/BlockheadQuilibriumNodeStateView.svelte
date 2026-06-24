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
			label: 'connection id',
		},
		{
			label: 'network',
		},
		'endpoint',
	],
	content: {
		dl: [
			[
				{
					label: 'connection id',
				},
				{
					label: 'network',
				},
				'endpoint',
				{
					label: 'gRPC/REST ports',
				},
				{
					label: 'peer id',
				},
				{
					label: 'latest frame',
				},
				{
					label: 'latest engine state',
				},
				{
					label: 'peer/prover count',
				},
				{
					label: 'latest sync time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped connected-node observations',
					},
				],
			},
			{
				label: 'Frames',
				items: [
					{
						label: 'locally observed frame heads',
					},
				],
			},
			{
				label: 'Provers',
				items: [
					{
						label: 'peers/provers exposed by the connected node',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					'endpoint',
					{
						label: 'scrape/RPC freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadQuilibriumNodeState>
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
	entityType={EntityType.BlockheadQuilibriumNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
