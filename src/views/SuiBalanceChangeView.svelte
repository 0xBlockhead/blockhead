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
			label: 'owner',
		},
		'$coinType',
		'amountDelta',
	],
	content: {
		dl: [
			[
				{
					label: 'owner',
				},
				'$coinType',
				{
					label: 'resolved SuiCoinType',
				},
				'amountDelta',
				'$transaction',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'SuiTransaction',
					},
				],
			},
			{
				label: 'Owner/coin',
				items: [
					'ownerSelector',
					'$coinType',
					{
						label: 'SuiCoinType',
					},
				],
			},
			{
				label: 'Delta',
				items: [
					'amountDelta',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Sui transaction effects balanceChanges payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiBalanceChange>
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
	entityType={EntityType.SuiBalanceChange}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
