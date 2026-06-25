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
		'$accountState',
		'transactionAddress',
		'$account',
	],
	content: {
		dl: [
			[
				'$accountState',
				'transactionAddress',
				'$account',
				'$refundAccount',
				'coinAddress',
			],
			[
				'amount',
				{
					label: 'delivery type/address',
				},
				{
					label: 'observation time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account state',
				items: [
					{
						label: 'parent local account state',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'public Quilibrium account when resolved',
					},
				],
			},
			{
				label: 'Refund account',
				items: [
					{
						label: 'public refund account when resolved',
					},
				],
			},
			{
				label: 'Connected node',
				items: [
					{
						label: 'parent Quilibrium node state',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'pendingTransactionsAccount response',
					},
					{
						label: 'delivery method context',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadQuilibriumPendingTransaction>
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
	entityType={EntityType.BlockheadQuilibriumPendingTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
