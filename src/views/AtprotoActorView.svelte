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
		'did',
		'handle',
		'displayName',
	],
	content: {
		dl: [
			[
				'did',
				'handle',
				'displayName',
				'description',
				{
					label: 'indexed time',
				},
				{
					label: 'icon/banner',
				},
			],
			[
				{
					label: 'latest follower/follow/post snapshot',
				},
				'$$posts',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Profile',
				items: [
					'displayName',
					'description',
					'$icon',
					'$banner',
					{
						label: 'indexed time',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped follower/follow/post counts',
					},
				],
			},
			{
				label: 'Posts',
				items: [
					{
						label: 'posts authored by this actor',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'app.bsky.actor.getProfile actor parameter by DID or handle',
					},
					{
						label: 'resolved DID/current handle tuple',
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
			id: 'posts',
			label: 'posts',
			field: '$$posts',
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
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoActor>
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
	entityType={EntityType.AtprotoActor}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
