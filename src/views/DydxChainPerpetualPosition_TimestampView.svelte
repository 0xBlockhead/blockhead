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
		'$subaccount',
		'$market',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$subaccount',
				'$market',
				'timestampMs',
				'source',
				'blockHeight',
			],
			[
				'side',
				'size',
				'entryPrice',
				'unrealizedPnl',
				'realizedPnl',
			],
			[
				'fundingIndex',
			],
		],
	},
	details: {
		tabs: [
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
						label: 'indexer position payload',
					},
					{
						label: 'validator app-state query',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainPerpetualPosition_Timestamp>
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
	entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
