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
			'coinId',
		],
		content: {
			dl: [
				[
					'coinId',
					'symbol',
					'name',
					'decimals',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
				{
					label: 'coin instances',
					when: 'open',
					items: [
						'$$coinInstances',
					],
				},
				{
					label: 'markets with coin as base',
					when: 'open',
					items: [
						'$$marketsWithCoinAsBase',
					],
				},
				{
					label: 'markets with coin as quote',
					when: 'open',
					items: [
						'$$marketsWithCoinAsQuote',
					],
				},
				{
					label: 'bridge capabilities',
					when: 'open',
					items: [
						'$$bridgeCapabilities',
					],
				},
				{
					label: 'asset supply timestamps',
					when: 'open',
					items: [
						'$$assetSupplyTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.Coin>
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
	entityType={EntityType.Coin}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
