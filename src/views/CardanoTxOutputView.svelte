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
		'outputIndex',
		'address',
		'lovelace',
	],
	content: {
		dl: [
			[
				'outputIndex',
				'address',
				'lovelace',
				{
					label: 'datum hash/inline datum presence',
				},
				'referenceScriptHash',
				{
					label: 'spent transaction hash/input index',
				},
				'$$assets',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Assets',
				items: [
					{
						label: 'multi-asset output amounts',
					},
				],
			},
			{
				label: 'Datum/script',
				items: [
					{
						label: 'structured datum',
					},
					{
						label: 'reference script panels',
					},
				],
			},
			{
				label: 'Address',
				items: [
					{
						label: 'linked Cardano address',
					},
				],
			},
			{
				label: 'Spending transaction',
				items: [
					{
						label: 'spending Cardano transaction when spentByTxHash resolves',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'assets',
			label: 'assets',
			field: '$$assets',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoTxOutput>
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
	entityType={EntityType.CardanoTxOutput}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
