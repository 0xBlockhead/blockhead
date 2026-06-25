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
		'$actorCoin',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$actorCoin',
				'timestampMs',
				'source',
				{
					label: 'block number when known',
				},
				'balance',
			],
			[
				'usdValue',
				'priceUsd',
				{
					label: 'token metadata summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Actor coin',
				items: [
					{
						label: 'parent actor/coin balance identity',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'parent EVM network account',
					},
				],
			},
			{
				label: 'Coin',
				items: [
					{
						label: 'EVM coin instance or token contract',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'EVM block when blockNumber resolves',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Allium latest wallet balance row or RPC balanceOf/eth_getBalance response',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkActorCoinBalance_Timestamp>
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
	entityType={EntityType.EvmNetworkActorCoinBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
