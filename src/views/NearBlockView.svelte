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
		'height',
		'hash',
		{
			label: 'epoch',
		},
	],
	content: {
		dl: [
			[
				'height',
				'hash',
				'$parent',
				'epochId',
				'timestampMs',
			],
			[
				'$$chunks',
				{
					label: 'parent/chain context',
				},
				{
					label: 'source evidence',
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
						label: 'NearNetwork/Network',
					},
				],
			},
			{
				label: 'Header',
				items: [
					'height',
					'hash',
					'$parent',
					'epochId',
					'timestampMs',
				],
			},
			{
				label: 'Chunks',
				items: [
					{
						label: 'NearChunk list',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'RPC block_id height lookup',
					},
					{
						label: 'RPC block_id hash lookup',
					},
					{
						label: 'NearBlocks indexer block lookup',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'NEAR RPC/indexer block payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'chunks',
			label: 'chunks',
			field: '$$chunks',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearBlock>
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
	entityType={EntityType.NearBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
