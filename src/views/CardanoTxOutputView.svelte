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
				label: 'output index',
			},
			'address',
			'lovelace',
		],
		content: {
			dl: [
				[
					{
						label: 'output index',
					},
					'address',
					'lovelace',
					{
						label: 'datum hash/inline datum presence',
					},
					{
						label: 'reference script hash',
					},
					{
						label: 'spent transaction hash/input index',
					},
					{
						label: 'asset count',
					},
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
