<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	route: {
		href: '/activitypub/note/[instanceOrigin]/[localStatusId]',
		dependsOn: [
			'instanceOrigin',
			'localStatusId',
		],
	},
	query: {
		sources: [
			'Mastodon_Rest',
			'Fedi_Rest',
		],
		openFields: [
			'$author',
			'$inReplyTo',
			'$reblogOf',
			'$$timestamps',
			'$$media',
			'$$thread',
		],
		slot: 'ActivityPubNoteQueryPolicy',
	},
	media: {
		slot: 'ActivityPubContentPreview',
	},
	lists: [
		{
			id: 'notes',
			label: 'Notes',
			limit: 50,
			query: {
				limit: 50,
			},
			item: 'link',
			itemHref: {
				label: '/activitypub/note/[instanceOrigin]/[localStatusId]',
			},
			key: 'localStatusId',
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
		{
			id: 'media',
			label: 'mediases',
			field: '$$media',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'thread',
			label: 'threadses',
			field: '$$thread',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
	display: [
		{
			field: 'content',
			kind: 'htmlText',
			slot: 'ActivityPubContentHtml',
		},
		{
			field: 'spoilerText',
			kind: 'textPreview',
			slot: 'ContentWarning',
		},
	],
	panels: [
		{
			id: 'content',
			label: 'Content',
			kind: 'media',
			defer: 'open',
			slot: 'ActivityPubContentPanel',
		},
	],
	slots: [
		{
			slot: 'ActivityPubContentPreview',
			label: 'content warning and HTML-to-text preview',
			for: 'Title',
		},
		{
			slot: 'ActivityPubNoteContent',
			label: 'content warning reveal and media rendering',
			for: 'Content',
		},
	],
	closed: [
		{
			label: 'content excerpt',
		},
		'$author',
		'createdAt',
	],
	content: {
		dl: [
			[
				'activityStreamsUri',
				'instanceOrigin',
				'localStatusId',
				'$author',
				'createdAt',
				{
					label: 'reply/reblog refs',
				},
			],
			[
				'statusUrl',
				{
					label: 'visibility/sensitive/language',
				},
				{
					label: 'media/thread counts',
				},
				{
					label: 'latest favourite/reblog/reply counters',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Content',
				items: [
					'content',
					'spoilerText',
					'language',
					'visibility',
					'sensitive',
					{
						label: 'media refs',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped favourite/reblog/reply counters',
					},
				],
			},
			{
				label: 'Thread',
				items: [
					{
						label: 'context ancestors/descendants from latest source window',
					},
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author ActivityPub actor',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'Mastodon/Fedi status id lookup',
					},
					{
						label: 'ActivityStreams URI search/dereference',
					},
					{
						label: 'status context lookup',
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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubNote>
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
	entityType={EntityType.ActivityPubNote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
