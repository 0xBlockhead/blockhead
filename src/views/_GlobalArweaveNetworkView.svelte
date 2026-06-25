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
		'scope',
		'$$timestamps',
		'$$sourceWindowNetworks',
	],
	content: {
		dl: [
			[
				'scope',
				'$$timestamps',
			],
			[
				'$$sourceWindowNetworks',
				'$$sourceWindowBlocks',
				'$$sourceWindowTransactions',
				'$$sourceWindowResources',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Source-window rows',
				items: [
					'$$sourceWindowNetworks',
					'$$sourceWindowBlocks',
					'$$sourceWindowTransactions',
					'$$sourceWindowResources',
				],
			},
			{
				label: 'Hub observations',
				items: [
					'$$timestamps',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'SourceBinding.Arweave_Graphql',
					},
					{
						label: 'SourceBinding.Arweave_Rest',
					},
					{
						label: 'SourceBinding.Constants_Internal',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'source-window-networks',
			label: 'source window networks',
			field: '$$sourceWindowNetworks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-blocks',
			label: 'source window blocks',
			field: '$$sourceWindowBlocks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-transactions',
			label: 'source window transactions',
			field: '$$sourceWindowTransactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-resources',
			label: 'source window resources',
			field: '$$sourceWindowResources',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalArweaveNetwork>
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
	entityType={EntityType._GlobalArweaveNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
