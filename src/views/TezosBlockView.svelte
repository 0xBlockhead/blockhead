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
			label: 'level/hash',
		},
		'timestampMs',
		{
			label: 'baker',
		},
	],
	content: {
		dl: [
			[
				'level',
				'hash',
				'timestampMs',
				{
					label: 'protocol',
				},
				{
					label: 'baker',
				},
			],
			[
				'round',
				'cycle',
				{
					label: 'predecessor',
				},
				'$$operations',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operation groups',
				items: [
					{
						label: 'operation groups included in block',
					},
				],
			},
			{
				label: 'Operations',
				items: [
					{
						label: 'operations by validation pass/kind',
					},
				],
			},
			{
				label: 'Baker',
				items: [
					{
						label: 'producing Tezos baker',
					},
				],
			},
			{
				label: 'Cycle',
				items: [
					{
						label: 'Tezos cycle',
					},
				],
			},
			{
				label: 'Header',
				items: [
					'payloadHash',
					'operationsHash',
					'fitness',
					{
						label: 'predecessor/successor context',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'node RPC block lookup by level or hash',
					},
					{
						label: 'TzKT/indexer block payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'operation-groups',
			label: 'operation groups',
			field: '$$operationGroups',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'operations',
			label: 'operations',
			field: '$$operations',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosBlock>
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
	entityType={EntityType.TezosBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
