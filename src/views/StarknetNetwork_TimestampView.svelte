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
		'$network',
		'timestampMs',
		{
			label: 'latest block',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'timestampMs',
				'source',
				'latestBlockNumber',
				'latestBlockHash',
			],
			[
				'syncing',
				'protocolVersion',
				'pendingBlockHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent Starknet network',
					},
				],
			},
			{
				label: 'Latest block',
				items: [
					{
						label: 'Starknet block when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'starknet_blockNumber',
					},
					{
						label: 'starknet_syncing',
					},
					{
						label: 'starknet_specVersion',
					},
					{
						label: 'indexer status payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetNetwork_Timestamp>
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
	entityType={EntityType.StarknetNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
