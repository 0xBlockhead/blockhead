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
		'id',
		'username',
		'name',
	],
	content: {
		dl: [
			[
				'id',
				'username',
				'createdAt',
				'name',
				'description',
			],
			[
				'verified',
				'location',
				'websiteUrl',
				{
					label: 'latest media',
				},
				{
					label: 'latest counters',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest profile',
				items: [
					{
						label: 'latest profile observation by timestamp/source',
					},
				],
			},
			{
				label: 'Profile history',
				items: [
					{
						label: 'profile observations',
					},
				],
			},
			{
				label: 'Posts',
				items: [
					{
						label: 'posts by this user',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'X v2 user lookup',
					},
					{
						label: 'FxEmbed user payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.XUser>
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
	entityType={EntityType.XUser}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
