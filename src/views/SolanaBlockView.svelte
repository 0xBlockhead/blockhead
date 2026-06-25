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
		'slot',
		'blockHeight',
	],
	content: {
		dl: [
			[
				'$network',
				'slot',
				'blockHeight',
				'blockHash',
				'previousBlockHash',
			],
			[
				{
					label: 'parent slot/block',
				},
				'timestampMs',
				'transactionCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions in this block',
					},
				],
			},
			{
				label: 'Parent',
				items: [
					{
						label: 'parent Solana block',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Solana network',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'getBlock slot lookup',
					},
					{
						label: 'getBlocks slot range',
					},
					{
						label: 'indexer block payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaBlock>
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
	entityType={EntityType.SolanaBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
