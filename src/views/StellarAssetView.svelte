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
		'assetKey',
		'assetKind',
		'$issuerAccount',
	],
	content: {
		dl: [
			[
				'assetKey',
				'assetKind',
				'assetCode',
				'$issuerAccount',
				'$$trustlines',
			],
			[
				'$$claimableBalances',
				'$$liquidityPools',
				{
					label: 'asset metadata',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Trustlines',
				items: [
					{
						label: 'asset trustlines',
					},
				],
			},
			{
				label: 'Claimable balances',
				items: [
					{
						label: 'claimable balances denominated in this asset',
					},
				],
			},
			{
				label: 'Liquidity pools',
				items: [
					{
						label: 'liquidity pools containing this asset',
					},
				],
			},
			{
				label: 'Offers',
				items: [
					{
						label: 'offers selling/buying this asset',
					},
				],
			},
			{
				label: 'Trades',
				items: [
					{
						label: 'trades involving this asset',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'TOML/explorer metadata when available',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'claimable-balances',
			label: 'claimable balances',
			field: '$$claimableBalances',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'liquidity-pools',
			label: 'liquidity pools',
			field: '$$liquidityPools',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'trustlines',
			label: 'trustlines',
			field: '$$trustlines',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'offers',
			label: 'offers',
			field: '$$offers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'trades',
			label: 'trades',
			field: '$$trades',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAsset>
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
	entityType={EntityType.StellarAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
