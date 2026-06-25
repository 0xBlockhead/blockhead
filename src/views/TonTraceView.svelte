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
		{
			label: 'trace id/root message',
		},
		'source',
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'trace id/root message',
				},
				'source',
				{
					label: 'start time',
				},
				{
					label: 'latest status',
				},
				'$$transactions',
				'$$messages',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Status snapshots',
				items: [
					{
						label: 'trace graph/status observations',
					},
				],
			},
			{
				label: 'Transaction DAG',
				items: [
					{
						label: 'transactions in trace order',
					},
				],
			},
			{
				label: 'Message edges',
				items: [
					{
						label: 'messages in trace graph',
					},
				],
			},
			{
				label: 'Root message',
				items: [
					{
						label: 'root message edge',
					},
				],
			},
			{
				label: 'Asset effects',
				items: [
					{
						label: 'decoded jetton and NFT transfer effects',
					},
				],
			},
			{
				label: 'Failures',
				items: [
					{
						label: 'failed phase/action summary from latest trace observation',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'trace payload',
					},
					{
						label: 'indexer trace id/root-message mapping',
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
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'messages',
			label: 'messages',
			field: '$$messages',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonTrace>
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
	entityType={EntityType.TonTrace}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
