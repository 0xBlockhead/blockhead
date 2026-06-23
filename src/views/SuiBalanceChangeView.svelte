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
			{
				label: 'coin type',
			},
			{
				label: 'amount delta',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'owner',
					},
					{
						label: 'coin type',
					},
					{
						label: 'resolved SuiCoinType',
					},
					{
						label: 'amount delta',
					},
					{
						label: 'parent transaction',
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
							label: 'SuiTransaction',
						},
					],
				},
				{
					label: 'Owner/coin',
					items: [
						{
							label: 'owner selector',
						},
						{
							label: 'coin type',
						},
						{
							label: 'SuiCoinType',
						},
					],
				},
				{
					label: 'Delta',
					items: [
						{
							label: 'amount delta',
						},
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
