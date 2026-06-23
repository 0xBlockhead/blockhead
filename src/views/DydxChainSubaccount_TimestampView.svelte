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
				label: 'subaccount',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'subaccount',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'block height',
					},
					'equity',
					{
						label: 'free collateral',
					},
					{
						label: 'margin usage',
					},
					{
						label: 'open position count',
					},
					{
						label: 'open order count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Subaccount',
					items: [
						{
							label: 'parent dYdX subaccount',
						},
					],
				},
				{
					label: 'Positions',
					items: [
						{
							label: 'position observations for same subaccount/time',
						},
					],
				},
				{
					label: 'Orders',
					items: [
						{
							label: 'orders for same subaccount/source window',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'indexer subaccount response',
						},
						{
							label: 'validator state query',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainSubaccount_Timestamp>
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
	entityType={EntityType.DydxChainSubaccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
