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
				label: 'output',
			},
			{
				label: 'category',
			},
			'capability',
		],
		content: {
			dl: [
				[
					{
						label: 'output',
					},
					{
						label: 'category',
					},
					'capability',
					{
						label: 'commitment status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Output',
					items: [
						{
							label: 'parent UTXO output',
						},
					],
				},
				{
					label: 'Category',
					items: [
						{
							label: 'parent CashToken category',
						},
					],
				},
				{
					label: 'Commitment',
					items: [
						{
							label: 'output-attached commitment',
						},
					],
				},
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent UTXO transaction through the output',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashCashTokenNft>
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
	entityType={EntityType.BitcoinCashCashTokenNft}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
