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
		'txHash',
		'txType',
		'$block',
	],
	content: {
		dl: [
			[
				'txHash',
				'txType',
				'$block',
				{
					label: 'source',
				},
				{
					label: 'destination',
				},
			],
			[
				'tokenSymbol',
				'amount',
				{
					label: 'fee',
				},
				'code',
				'memo',
			],
			[
				{
					label: 'order/trade fields when present',
				},
				{
					label: 'raw archive payload',
				},
				{
					label: 'migration linkage',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Block',
				items: [
					{
						label: 'BnbBeaconBlock',
					},
				],
			},
			{
				label: 'Transfer/order fields',
				items: [
					{
						label: 'source',
					},
					{
						label: 'destination',
					},
					'tokenSymbol',
					'amount',
					'orderId',
				],
			},
			{
				label: 'Effects',
				items: [
					{
						label: 'BnbBeaconTokenTransfer list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'archive/API/explorer transaction payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'token-effects',
			label: 'token effects',
			field: '$$tokenEffects',
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
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconTransaction>
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
	entityType={EntityType.BnbBeaconTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
