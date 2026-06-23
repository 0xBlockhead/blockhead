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
				label: 'slow/average/fast gwei',
			},
			{
				label: 'observation timestamp',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'slow/average/fast gwei',
					},
					{
						label: 'observation timestamp',
					},
					'source',
					{
						label: 'transport/source methodology',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent EVM network',
						},
					],
				},
				{
					label: 'Gas tiers',
					items: [
						{
							label: 'slow',
						},
						{
							label: 'average',
						},
						{
							label: 'fast values and provider methodology',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Blockscout gas_prices',
						},
						{
							label: 'Etherscan gasoracle payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp>
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
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
