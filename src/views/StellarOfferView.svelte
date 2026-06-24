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
			label: 'offer id',
		},
		{
			label: 'seller',
		},
		{
			label: 'asset pair',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'offer id',
				},
				{
					label: 'seller',
				},
				{
					label: 'asset pair',
				},
				{
					label: 'latest amount/price observation',
				},
				{
					label: 'latest modified ledger observation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest ledger/source offer observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped offer observations',
					},
				],
			},
			{
				label: 'Trades',
				items: [
					{
						label: 'trades against this offer',
					},
				],
			},
			{
				label: 'Seller',
				items: [
					{
						label: 'seller Stellar account',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'selling/buying assets',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon offer object',
					},
					{
						label: 'RPC offer ledger entry',
					},
					{
						label: 'indexer orderbook history',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarOffer>
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
	entityType={EntityType.StellarOffer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
