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
		'tableHandle',
		'keyHash',
	],
	content: {
		dl: [
			[
				'$network',
				'tableHandle',
				'keyHash',
				'keyType',
				'valueType',
			],
			[
				{
					label: 'key summary',
				},
				{
					label: 'latest value/hash summary',
				},
				{
					label: 'latest ledger version/source',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Value observations',
				items: [
					{
						label: 'ledger-versioned table item values',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Aptos network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'table item request body',
					},
					{
						label: 'response',
					},
					{
						label: 'pruning/freshness status',
					},
					{
						label: 'indexer coordinates',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AptosTableItem>
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
	entityType={EntityType.AptosTableItem}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
