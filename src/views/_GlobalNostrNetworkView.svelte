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
		'$$sourceWindowProfiles',
	],
	content: {
		dl: [
			[
				'scope',
				'$$timestamps',
			],
			[
				'$$sourceWindowProfiles',
				'$$sourceWindowNotes',
				'$$sourceWindowRelays',
				'$$sourceWindowReposts',
				'$$sourceWindowArticles',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Source-window rows',
				items: [
					'$$sourceWindowProfiles',
					'$$sourceWindowNotes',
					'$$sourceWindowRelays',
					'$$sourceWindowReposts',
					'$$sourceWindowArticles',
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
						label: 'SourceBinding.Constants_Internal',
					},
					{
						label: 'SourceBinding.NostrBand_Rest',
					},
					{
						label: 'SourceBinding.NostrRelay_Nip11_Http',
					},
					{
						label: 'SourceBinding.NostrRelay_WebSocket',
					},
					{
						label: 'SourceBinding.Primal_Rest',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'source-window-profiles',
			label: 'source window profiles',
			field: '$$sourceWindowProfiles',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-notes',
			label: 'source window notes',
			field: '$$sourceWindowNotes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-relays',
			label: 'source window relays',
			field: '$$sourceWindowRelays',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-reposts',
			label: 'source window reposts',
			field: '$$sourceWindowReposts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'source-window-articles',
			label: 'source window articles',
			field: '$$sourceWindowArticles',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalNostrNetwork>
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
	entityType={EntityType._GlobalNostrNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
