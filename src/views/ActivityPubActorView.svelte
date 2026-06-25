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
			label: 'icon/header image',
		},
		'displayName',
		'acct',
	],
	content: {
		dl: [
			[
				'acct',
				'activityStreamsUri',
				'instanceOrigin',
				'localAccountId',
				'createdAt',
			],
			[
				'profileUrl',
				{
					label: 'bot/locked flags',
				},
				{
					label: 'latest follower/following/status counters',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Profile',
				items: [
					'displayName',
					'note',
					'$icon',
					'$headerImage',
					'website',
					'profileUrl',
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped follower/following/status counters',
					},
				],
			},
			{
				label: 'Outbox',
				items: [
					{
						label: 'note rows authored by this actor',
					},
				],
			},
			{
				label: 'Federation identity',
				items: [
					'activityStreamsUri',
					'instanceOrigin',
					'localAccountId',
					{
						label: 'acct selector',
					},
					{
						label: 'WebFinger link evidence',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'Mastodon/Fedi account id lookup',
					},
					{
						label: 'acct lookup',
					},
					{
						label: 'ActivityStreams URI search/dereference',
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
			id: 'notes',
			label: 'notes',
			field: '$$notes',
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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubActor>
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
	entityType={EntityType.ActivityPubActor}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
