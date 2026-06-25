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
		'$market',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$market',
				'timestampMs',
				'source',
				'oraclePrice',
				'fundingRate',
			],
			[
				'openInterest',
				'status',
				{
					label: 'next funding time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Market',
				items: [
					{
						label: 'parent dYdX market',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'indexer market snapshot',
					},
					{
						label: 'validator/query app-state response',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainMarket_Timestamp>
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
	entityType={EntityType.DydxChainMarket_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
