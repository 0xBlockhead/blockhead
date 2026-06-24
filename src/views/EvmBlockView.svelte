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
			label: 'block number',
		},
		'hash',
		{
			label: 'transaction count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'block number',
				},
				'hash',
				'timestamp',
				{
					label: 'gas/base fee/blob gas',
				},
				{
					label: 'parent block',
				},
				{
					label: 'miner/validator account',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Chain',
				items: [
					{
						label: 'parent EVM network',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions included in the block',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'eth_getBlockByNumber',
					},
					{
						label: 'eth_getBlockByHash',
					},
					{
						label: 'explorer block detail/list payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmBlock>
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
	entityType={EntityType.EvmBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
