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
			label: 'base fee/gas price',
		},
		'blockNumber',
		'gasUsedRatio',
	],
	content: {
		dl: [
			[
				{
					label: 'base fee/gas price',
				},
				'blockNumber',
				'gasUsedRatio',
				{
					label: 'priority fee percentile',
				},
				{
					label: 'blob base fee',
				},
				'blobGasUsedRatio',
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
				label: 'Block',
				items: [
					{
						label: 'EVM block for blockNumber when resolved',
					},
				],
			},
			{
				label: 'Fee history',
				items: [
					{
						label: 'base fee',
					},
					{
						label: 'priority fee percentile',
					},
					{
						label: 'blob fee fields',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'eth_feeHistory/eth_gasPrice/eth_maxPriorityFeePerGas response',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetwork_GasFee_Block>
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
	entityType={EntityType.EvmNetwork_GasFee_Block}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
