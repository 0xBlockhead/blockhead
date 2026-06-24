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
			label: 'block',
		},
		'balance',
		'usdValue',
	],
	content: {
		dl: [
			[
				{
					label: 'block',
				},
				'balance',
				'usdValue',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account balance',
				items: [
					{
						label: 'EvmNetworkActorCoinBalance',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'EvmBlock',
					},
				],
			},
			{
				label: 'Value',
				items: [
					{
						label: 'raw balance',
					},
					{
						label: 'USD value when quote/indexer source exists',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'eth_getBalance or ERC-20 balanceOf block-tag result',
					},
					{
						label: 'indexer balance snapshot',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkActorCoinBalance_EvmBlock>
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
	entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
