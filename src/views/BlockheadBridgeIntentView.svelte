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
			'sessionId',
			'actionId',
		],
		content: {
			dl: [
				[
					'sessionId',
					'actionId',
					'fromNetworkCaip2',
					'toNetworkCaip2',
					'assetCaip19',
					'fromAssetCaip19',
					'toAssetCaip19',
					'fromChainId',
					'toChainId',
					'coinId',
					'fromTokenAddress',
					'toTokenAddress',
					'amount',
					'slippage',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'quotes',
					when: 'open',
					items: [
						'$$quotes',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadBridgeIntent>
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
	entityType={EntityType.BlockheadBridgeIntent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
