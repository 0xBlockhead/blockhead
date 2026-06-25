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
			label: 'ISO code',
		},
		'name',
		'symbol',
	],
	content: {
		dl: [
			[
				{
					label: 'ISO code',
				},
				'name',
				'symbol',
				'minorUnitExponent',
				'catalogSortWeight',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Markets as base',
				items: [
					{
						label: 'Market list',
					},
				],
			},
			{
				label: 'Markets as quote',
				items: [
					{
						label: 'Market list',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'markets-with-currency-as-base',
			label: 'markets with currency as base',
			field: '$$marketsWithCurrencyAsBase',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'markets-with-currency-as-quote',
			label: 'markets with currency as quote',
			field: '$$marketsWithCurrencyAsQuote',
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
			selection: EntityProxyResource<typeof schema, EntityType.Currency>
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
	entityType={EntityType.Currency}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
