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
		'operationKind',
		{
			label: 'operation hash/content index',
		},
		'status',
	],
	content: {
		dl: [
			[
				'operationKind',
				{
					label: 'operation hash/content index',
				},
				'status',
				{
					label: 'source',
				},
				{
					label: 'destination/delegate/contract',
				},
			],
			[
				'counter',
				{
					label: 'fee',
				},
				{
					label: 'amount',
				},
				{
					label: 'token transfer count',
				},
				'$$bigMapDiffs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Gas/storage/result',
				items: [
					'consumedGas',
					'storageSize',
					{
						label: 'paid storage diff',
					},
					{
						label: 'errors',
					},
				],
			},
			{
				label: 'Parameters',
				items: [
					{
						label: 'decoded parameter payload',
					},
				],
			},
			{
				label: 'Internal operations',
				items: [
					{
						label: 'internal operation effects',
					},
				],
			},
			{
				label: 'Big-map diffs',
				items: [
					{
						label: 'big-map diff effects',
					},
				],
			},
			{
				label: 'Token transfers',
				items: [
					{
						label: 'token transfers sourced from this operation',
					},
				],
			},
			{
				label: 'Originated contracts',
				items: [
					{
						label: 'originated contracts',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node/indexer operation payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'internal-operations',
			label: 'internal operations',
			field: '$$internalOperations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'big-map-diffs',
			label: 'big map diffs',
			field: '$$bigMapDiffs',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosOperation>
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
	entityType={EntityType.TezosOperation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
