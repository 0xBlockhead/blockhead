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
				label: 'account',
			},
			{
				label: 'trade id',
			},
			{
				label: 'order id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'trade id',
					},
					{
						label: 'order id',
					},
					'coin',
					'side',
					'direction',
					'price',
					'size',
					'fee',
					{
						label: 'fee token',
					},
					{
						label: 'closed PnL',
					},
					{
						label: 'time',
					},
					'hash',
					{
						label: 'crossed flag',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'parent Hyperliquid account',
						},
					],
				},
				{
					label: 'Order',
					items: [
						{
							label: 'linked Hyperliquid order when order id resolves',
						},
					],
				},
				{
					label: 'Transaction',
					items: [
						{
							label: 'HyperEVM transaction when hash maps to execution',
						},
					],
				},
				{
					label: 'Fill economics',
					items: [
						'price',
						'size',
						'fee',
						{
							label: 'start position',
						},
						{
							label: 'PnL fields',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'userFills or userFillsByTime payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidFill>
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
	entityType={EntityType.HyperliquidFill}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
