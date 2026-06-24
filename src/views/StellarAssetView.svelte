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
			label: 'asset key',
		},
		{
			label: 'asset kind',
		},
		{
			label: 'issuer account',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'asset key',
				},
				{
					label: 'asset kind',
				},
				{
					label: 'asset code',
				},
				{
					label: 'issuer account',
				},
				{
					label: 'trustline count',
				},
				{
					label: 'claimable balance count',
				},
				{
					label: 'liquidity pool count',
				},
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
