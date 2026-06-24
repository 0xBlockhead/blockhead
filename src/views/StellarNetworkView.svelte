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
			label: 'linked Network',
		},
		{
			label: 'network passphrase',
		},
		{
			label: 'latest network observation',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'linked Network',
				},
				{
					label: 'network passphrase',
				},
				{
					label: 'latest ledger/protocol observation',
				},
				{
					label: 'base fee/reserve observation',
				},
			],
			[
				{
					label: 'native XLM asset',
				},
				{
					label: 'bounded contract/liquidity-pool/account/transaction windows',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'timestamped network observations',
					},
				],
			},
			{
				label: 'Ledgers',
				items: [
					{
						label: 'Stellar ledger rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Stellar transaction rows',
					},
				],
			},
			{
				label: 'Operations',
				items: [
					{
						label: 'Stellar operation rows',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'Stellar account rows',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'Stellar asset rows',
					},
				],
			},
			{
				label: 'Claimable balances',
				items: [
					{
						label: 'Stellar claimable balance rows',
					},
				],
			},
			{
				label: 'Liquidity pools',
				items: [
					{
						label: 'Stellar liquidity pool rows',
					},
				],
			},
			{
				label: 'Offers',
				items: [
					{
						label: 'Stellar offer rows',
					},
				],
			},
			{
				label: 'Trades',
				items: [
					{
						label: 'Stellar trade rows',
					},
				],
			},
			{
				label: 'Soroban contracts',
				items: [
					{
						label: 'Soroban contract rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarNetwork>
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
	entityType={EntityType.StellarNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
