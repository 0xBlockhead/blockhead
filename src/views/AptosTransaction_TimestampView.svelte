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
			label: 'transaction',
		},
		{
			label: 'ledger version',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'transaction',
				},
				{
					label: 'ledger version',
				},
				'source',
				{
					label: 'observation time',
				},
				{
					label: 'block height',
				},
				{
					label: 'success/vm status',
				},
			],
			[
				{
					label: 'gas unit price',
				},
				{
					label: 'gas used',
				},
				{
					label: 'accumulator root hash',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent transaction identity',
					},
				],
			},
			{
				label: 'State changes',
				items: [
					{
						label: 'state changes for the same transaction',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'events for the same transaction',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'fullnode transaction response',
					},
					{
						label: 'indexer transaction payload',
					},
					{
						label: 'ledger info headers/freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosTransaction_Timestamp>
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
	entityType={EntityType.AptosTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
