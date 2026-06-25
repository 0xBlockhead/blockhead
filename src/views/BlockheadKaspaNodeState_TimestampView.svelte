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
		'$nodeState',
		'timestampMs',
		{
			label: 'sync state',
		},
	],
	content: {
		dl: [
			[
				'$nodeState',
				'timestampMs',
				'source',
				'serverVersion',
				{
					label: 'sync state',
				},
			],
			[
				{
					label: 'UTXO-index availability',
				},
				'virtualDaaScore',
				{
					label: 'selected parent',
				},
				{
					label: 'pruning point',
				},
				'peerCount',
			],
			[
				{
					label: 'last synced time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node',
				items: [
					{
						label: 'parent connected Kaspa node state',
					},
				],
			},
			{
				label: 'Network observation',
				items: [
					{
						label: 'network timestamp observation when materialized',
					},
				],
			},
			{
				label: 'Virtual chain',
				items: [
					{
						label: 'virtual-chain rows from this node',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getServerInfo/getBlockDagInfo/peer payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadKaspaNodeState_Timestamp>
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
	entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
