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
			'type',
		],
		content: {
			dl: [
				[
					'type',
					'coinId',
					'name',
					'symbol',
					'decimals',
					'iconUrl',
					'caip19',
					'representation',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'markets with instance as base',
					when: 'open',
					items: [
						'$$marketsWithInstanceAsBase',
					],
				},
				{
					label: 'markets with instance as quote',
					when: 'open',
					items: [
						'$$marketsWithInstanceAsQuote',
					],
				},
				{
					label: 'outbound bridge capabilities',
					when: 'open',
					items: [
						'$$outboundBridgeCapabilities',
					],
				},
				{
					label: 'inbound bridge capabilities',
					when: 'open',
					items: [
						'$$inboundBridgeCapabilities',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmCoinInstance>
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
	entityType={EntityType.EvmCoinInstance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
