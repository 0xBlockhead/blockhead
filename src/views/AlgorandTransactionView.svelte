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
		'txId',
		'transactionType',
		'sender',
	],
	content: {
		dl: [
			[
				'txId',
				'transactionType',
				'sender',
				'round',
				'fee',
			],
			[
				{
					label: 'group id',
				},
				{
					label: 'parent/inner index when present',
				},
				'$$proofs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Group',
				items: [
					{
						label: 'atomic transaction group when present',
					},
				],
			},
			{
				label: 'Inner transactions',
				items: [
					{
						label: 'nested transactions by parent/index',
					},
				],
			},
			{
				label: 'Proofs',
				items: [
					{
						label: 'transaction inclusion proofs',
					},
				],
			},
			{
				label: 'Logs',
				items: [
					{
						label: 'decoded/raw logs',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'type-specific transaction JSON',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'proofs',
			label: 'proofs',
			field: '$$proofs',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTransaction>
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
	entityType={EntityType.AlgorandTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
