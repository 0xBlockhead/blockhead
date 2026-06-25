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
			label: 'from/to EvmCoinInstance refs',
		},
		'toolKey',
		{
			label: 'rail',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'from/to EvmCoinInstance refs',
				},
				'toolKey',
				{
					label: 'rail',
				},
				'settlementModel',
				'verificationModel',
				'assetOutcome',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Route endpoints',
				items: [
					{
						label: 'from EvmCoinInstance',
					},
					{
						label: 'to EvmCoinInstance',
					},
				],
			},
			{
				label: 'Catalog tool',
				items: [
					'toolKey',
					{
						label: 'LI.FI tool/source row when available',
					},
				],
			},
			{
				label: 'Rail/trust model',
				items: [
					'railId',
					'settlementModel',
					'verificationModel',
				],
			},
			{
				label: 'Asset outcome',
				items: [
					{
						label: 'wrapped/native/canonical result semantics',
					},
				],
			},
			{
				label: 'Quotes/transfers',
				items: [
					{
						label: 'BridgeRouteQuote_Timestamp',
					},
					{
						label: 'BridgeTransfer when executed',
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
			selection: EntityProxyResource<typeof schema, EntityType.CoinBridgeCapability>
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
	entityType={EntityType.CoinBridgeCapability}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
