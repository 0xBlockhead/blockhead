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
		'name',
		'url',
	],
	content: {
		dl: [
			[
				'id',
				'name',
				'url',
				'description',
				{
					label: 'icon URL/media',
				},
			],
			[
				{
					label: 'header image URL/media',
				},
				'$lead',
				'$moderator',
				'createdAt',
				'pinnedCastHash',
			],
			[
				{
					label: 'public-casting policy',
				},
				{
					label: 'external link',
				},
				{
					label: 'followed time',
				},
				{
					label: 'latest follower/member snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Casts',
				items: [
					{
						label: 'casts linked to this channel',
					},
				],
			},
			{
				label: 'Moderators',
				items: [
					{
						label: 'lead/moderator user refs',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped follower/member observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'moderators',
			label: 'moderators',
			field: '$$moderators',
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
		{
			id: 'casts',
			label: 'casts',
			field: '$$casts',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterChannel>
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
	entityType={EntityType.FarcasterChannel}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
