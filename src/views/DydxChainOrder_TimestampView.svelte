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
			label: 'order',
		},
		{
			label: 'observation time',
		},
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'order',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'block height',
				},
				'status',
				'price',
				'size',
				{
					label: 'remaining size',
				},
				{
					label: 'filled size',
				},
				{
					label: 'total filled',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Order',
				items: [
					{
						label: 'parent dYdX order',
					},
				],
			},
			{
				label: 'Subaccount',
				items: [
					{
						label: 'parent dYdX subaccount',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'indexer order response',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainOrder_Timestamp>
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
	entityType={EntityType.DydxChainOrder_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
