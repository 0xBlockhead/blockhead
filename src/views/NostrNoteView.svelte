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
		'eventId',
		'kind',
		{
			label: 'author pubkey/profile',
		},
	],
	content: {
		dl: [
			[
				'eventId',
				'kind',
				{
					label: 'author pubkey/profile',
				},
				'createdAt',
				{
					label: 'direct reply event id',
				},
			],
			[
				'rootEventId',
				'$replyToNote',
				{
					label: 'reply count',
				},
				'$$reactions',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Note text',
				items: [
					'content',
				],
			},
			{
				label: 'Reply thread',
				items: [
					{
						label: 'reply notes resolved from tags/indexer thread context',
					},
				],
			},
			{
				label: 'Reactions',
				items: [
					{
						label: 'reaction events targeting this note',
					},
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author Nostr profile',
					},
				],
			},
			{
				label: 'Raw event',
				items: [
					{
						label: 'kind/pubkey/tags/signature/source relays',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'replies',
			label: 'replies',
			field: '$$replies',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'reactions',
			label: 'reactions',
			field: '$$reactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.NostrNote>
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
	entityType={EntityType.NostrNote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
