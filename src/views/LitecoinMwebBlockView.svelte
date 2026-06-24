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
			label: 'parent UTXO block',
		},
		{
			label: 'HogEx transaction id',
		},
		{
			label: 'kernel root',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'parent UTXO block',
				},
				{
					label: 'HogEx transaction id',
				},
				{
					label: 'kernel root',
				},
				{
					label: 'MWEB transaction count',
				},
				{
					label: 'peg-in count',
				},
				{
					label: 'peg-out count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parent block',
				items: [
					{
						label: 'parent Litecoin UTXO block',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'MWEB transactions in this extension block',
					},
				],
			},
			{
				label: 'Peg flows',
				items: [
					{
						label: 'peg-ins and peg-outs through transactions',
					},
				],
			},
			{
				label: 'Wallet matches',
				items: [
					{
						label: 'BlockheadLitecoinMwebWalletState when a connected wallet has scanned this block',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'verbose Litecoin Core block payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebBlock>
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
	entityType={EntityType.LitecoinMwebBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
