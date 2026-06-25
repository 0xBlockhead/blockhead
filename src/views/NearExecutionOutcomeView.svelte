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
		'$transaction',
		'outcomeId',
		'status',
	],
	content: {
		dl: [
			[
				'$transaction',
				'outcomeId',
				'status',
				'gasBurnt',
				{
					label: 'spawned receipt count',
				},
				{
					label: 'status payload',
				},
				{
					label: 'gas/profile evidence',
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
						label: 'NearTransaction',
					},
				],
			},
			{
				label: 'Outcome',
				items: [
					'outcomeId',
					'status',
					'gasBurnt',
				],
			},
			{
				label: 'Receipts',
				items: [
					{
						label: 'NearReceipt list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'NEAR transaction status outcome payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'receipts',
			label: 'receipts',
			field: '$$receipts',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearExecutionOutcome>
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
	entityType={EntityType.NearExecutionOutcome}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
