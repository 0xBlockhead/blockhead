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
			'id',
			{
				label: 'network',
			},
			{
				label: 'token pair',
			},
		],
		content: {
			dl: [
				[
					'id',
					{
						label: 'network',
					},
					{
						label: 'token in/out',
					},
					{
						label: 'amount in/out',
					},
					'timestamp',
				],
				[
					{
						label: 'price impact',
					},
					{
						label: 'gas estimate',
					},
					{
						label: 'route hop count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Route payload',
					items: [
						{
							label: 'inline route array from implemented schema',
						},
					],
				},
				{
					label: 'Tokens',
					items: [
						{
							label: 'input/output EVM coin instances',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'EVM network',
						},
					],
				},
				{
					label: 'Target model',
					items: [
						{
							label: 'SwapQuote_Timestamp and SwapQuoteStep should replace this row for sourced aggregator quotes',
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
			selection: EntityProxyResource<typeof schema, EntityType.SwapQuote>
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
	entityType={EntityType.SwapQuote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
