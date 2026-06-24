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
			label: 'observation time',
		},
		{
			label: 'latest block',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'latest block number',
				},
				{
					label: 'latest block hash',
				},
				{
					label: 'syncing state',
				},
				{
					label: 'protocol version',
				},
				{
					label: 'pending block hash',
				},
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
