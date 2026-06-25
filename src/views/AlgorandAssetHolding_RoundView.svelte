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
		'$account',
		'$asset',
		'round',
	],
	content: {
		dl: [
			[
				'$account',
				'$asset',
				'round',
				'source',
				'amount',
			],
			[
				'frozen',
				{
					label: 'opt-in round',
				},
				'deleted',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent Algorand account',
					},
				],
			},
			{
				label: 'Asset',
				items: [
					{
						label: 'parent Algorand asset',
					},
				],
			},
			{
				label: 'Round context',
				items: [
					{
						label: 'ledger round coordinate',
					},
				],
			},
			{
				label: 'Transfer history',
				items: [
					{
						label: 'asset/account transactions when indexed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'account asset-holding payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandAssetHolding_Round>
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
	entityType={EntityType.AlgorandAssetHolding_Round}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
