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
		'chunkHash',
		'$block',
		'shardId',
	],
	content: {
		dl: [
			[
				'chunkHash',
				'$block',
				'shardId',
				'gasUsed',
				'$$transactions',
				{
					label: 'shard/block context',
				},
				{
					label: 'raw chunk evidence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Block',
				items: [
					{
						label: 'NearBlock',
					},
				],
			},
			{
				label: 'Shard execution',
				items: [
					'shardId',
					'gasUsed',
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'NearTransaction list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'NEAR RPC chunk payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearChunk>
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
	entityType={EntityType.NearChunk}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
