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
			label: 'from-chain -> to-chain ids',
		},
		{
			label: 'token pair',
		},
		{
			label: 'request amount',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'from-chain -> to-chain ids',
				},
				{
					label: 'from/to token addresses',
				},
				'fromAmount',
				{
					label: 'from/to addresses',
				},
				'slippage',
			],
			[
				'toAmount',
				{
					label: 'minimum received',
				},
				'estimatedCostUsd',
				{
					label: 'ETA',
				},
				'tags',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Steps',
				items: [
					{
						label: 'ordered BridgeRouteStep rows',
					},
				],
			},
			{
				label: 'Networks',
				items: [
					{
						label: 'from/to EVM network refs',
					},
				],
			},
			{
				label: 'Request',
				items: [
					{
						label: 'quote selector fields',
					},
				],
			},
			{
				label: 'Quote result',
				items: [
					{
						label: 'amounts',
					},
					{
						label: 'cost',
					},
					{
						label: 'duration',
					},
					'tags',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'LI.FI quote response',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'steps',
			label: 'steps',
			field: '$$steps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRoute>
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
	entityType={EntityType.BridgeRoute}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
