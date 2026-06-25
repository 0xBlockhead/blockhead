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
		'$transaction',
		'pegInIndex',
		'$transparentOutput',
	],
	content: {
		dl: [
			[
				'$transaction',
				'pegInIndex',
				'$transparentOutput',
				{
					label: 'amount in litoshis',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent MWEB transaction',
					},
				],
			},
			{
				label: 'Transparent output',
				items: [
					{
						label: 'linked transparent UTXO output',
					},
				],
			},
			{
				label: 'Wallet context',
				items: [
					{
						label: 'connected wallet ownership only through BlockheadLitecoinMwebWalletState',
					},
				],
			},
			{
				label: 'Amount',
				items: [
					{
						label: 'peg-in accounting context',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Litecoin Core MWEB peg-in payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebPegIn>
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
	entityType={EntityType.LitecoinMwebPegIn}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
