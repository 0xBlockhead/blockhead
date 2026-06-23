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
			{
				label: 'block hash',
			},
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'block number',
					},
					{
						label: 'block hash',
					},
					{
						label: 'parent hash',
					},
					{
						label: 'state root',
					},
					{
						label: 'timestamp',
					},
					{
						label: 'sequencer address',
					},
					{
						label: 'gas price summary',
					},
					'status',
					{
						label: 'transaction count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transactions',
					items: [
						{
							label: 'transactions in this block',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Starknet network',
						},
					],
				},
				{
					label: 'Lookup evidence',
					items: [
						{
							label: 'starknet_getBlockWithTxs block_id',
						},
						{
							label: 'starknet_getBlockWithTxHashes block_id',
						},
						{
							label: 'indexer block payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetBlock>
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
	entityType={EntityType.StarknetBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
