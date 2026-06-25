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
		'connectionId',
		'$network',
		'rpcUrl',
	],
	content: {
		dl: [
			[
				'connectionId',
				'$network',
				'rpcUrl',
				'encoding',
				'networkId',
				{
					label: 'latest server version/sync/head state',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node observations',
				items: [
					{
						label: 'timestamped connected-node observations',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Kaspa network',
					},
				],
			},
			{
				label: 'Node head',
				items: [
					{
						label: 'network timestamp observation when materialized from this connected node',
					},
				],
			},
			{
				label: 'Virtual chain',
				items: [
					{
						label: 'virtual-chain observations from local checkpoint pulls',
					},
				],
			},
			{
				label: 'Transport',
				items: [
					{
						label: 'wRPC/gRPC connection metadata',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'local node RPC payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadKaspaNodeState>
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
	entityType={EntityType.BlockheadKaspaNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
