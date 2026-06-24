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
			label: 'network',
		},
		{
			label: 'best block',
		},
		{
			label: 'suggested fee',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'best block',
				},
				{
					label: 'suggested fee',
				},
				{
					label: 'mempool transaction count',
				},
				{
					label: 'native asset',
				},
				{
					label: 'chain family',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blocks',
				items: [
					{
						label: 'UTXO-family blocks',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'UTXO-family transactions',
					},
				],
			},
			{
				label: 'Mempool & fees',
				items: [
					{
						label: 'network state observations',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'native coin plus Elements/CashToken facets when present',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'explorers',
					},
					{
						label: 'faucets',
					},
					{
						label: 'RPC endpoints',
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoNetwork>
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
	entityType={EntityType.UtxoNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
