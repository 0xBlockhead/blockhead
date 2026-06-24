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
			label: 'order id',
		},
		{
			label: 'market',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'subaccount',
				},
				{
					label: 'order id',
				},
				{
					label: 'market',
				},
				'side',
				{
					label: 'order type',
				},
				{
					label: 'time in force',
				},
				{
					label: 'client id',
				},
				{
					label: 'good-til block/time',
				},
				{
					label: 'latest status/fill summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Order observations',
				items: [
					{
						label: 'timestamped order lifecycle observations',
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
				label: 'Market',
				items: [
					{
						label: 'linked dYdX market',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'indexer order payload',
					},
					{
						label: 'stateful order query when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainOrder>
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
	entityType={EntityType.DydxChainOrder}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
