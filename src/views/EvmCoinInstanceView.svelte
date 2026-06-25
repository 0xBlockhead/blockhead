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
		'$icon',
		{
			label: 'symbol/name fallback',
		},
		{
			label: 'chain',
		},
	],
	content: {
		dl: [
			[
				'$icon',
				{
					label: 'symbol/name fallback',
				},
				{
					label: 'chain',
				},
				{
					label: 'native/token contract kind',
				},
				'name',
			],
			[
				'symbol',
				'decimals',
				'caip19',
				'representation',
				{
					label: 'canonical deployment',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Bridging',
				items: [
					{
						label: 'outbound/inbound bridge capability rows',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'markets-with-instance-as-base',
			label: 'markets with instance as base',
			field: '$$marketsWithInstanceAsBase',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'markets-with-instance-as-quote',
			label: 'markets with instance as quote',
			field: '$$marketsWithInstanceAsQuote',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'outbound-bridge-capabilities',
			label: 'outbound bridge capabilities',
			field: '$$outboundBridgeCapabilities',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'inbound-bridge-capabilities',
			label: 'inbound bridge capabilities',
			field: '$$inboundBridgeCapabilities',
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
