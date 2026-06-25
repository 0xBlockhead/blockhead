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
		'height',
		'hash',
	],
	content: {
		dl: [
			[
				'$network',
				'height',
				'hash',
				'timestampMs',
				'$$transactions',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transactions',
				items: [
					{
						label: 'Hyperliquid transactions in this block',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Hyperliquid network',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'eth_getBlockByNumber height lookup',
					},
					{
						label: 'returned block hash',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidBlock>
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
	entityType={EntityType.HyperliquidBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
