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
			'fromChainId',
			'toChainId',
			'fromToken',
			'toToken',
			'fromAmount',
			'fromAddress',
			'slippage',
			'toAddress',
		],
		content: {
			dl: [
				[
					'fromChainId',
					'toChainId',
					'fromToken',
					'toToken',
					'fromAmount',
					'fromAddress',
					'slippage',
					'toAddress',
					'toAmount',
					'toAmountMin',
					'estimatedCostUsd',
					'estimatedDurationSeconds',
					'tags',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'steps',
					when: 'open',
					items: [
						'$$steps',
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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRoute>
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
	entityType={EntityType.BridgeRoute}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
