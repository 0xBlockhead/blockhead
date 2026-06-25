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
		'$network',
		'bookKey',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$network',
				'bookKey',
				'timestampMs',
				'source',
				{
					label: 'perp market or spot pair ref',
				},
			],
			[
				{
					label: 'bid level count',
				},
				{
					label: 'ask level count',
				},
				{
					label: 'significant-figure aggregation',
				},
				'mantissa',
				'depthLimit',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Perp market',
				items: [
					{
						label: 'linked perp market when book key resolves to a perp coin',
					},
				],
			},
			{
				label: 'Spot pair',
				items: [
					{
						label: 'linked spot pair when book key resolves to a spot pair',
					},
				],
			},
			{
				label: 'Book levels',
				items: [
					{
						label: 'bid/ask JSON levels',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw l2Book response',
					},
					{
						label: 'request aggregation parameters',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidOrderbook_Timestamp>
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
	entityType={EntityType.HyperliquidOrderbook_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
