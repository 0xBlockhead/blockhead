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
		'$author',
		'$feed',
	],
	content: {
		dl: [
			[
				'id',
				'$author',
				'$feed',
				{
					label: 'text preview',
				},
				'timestamp',
			],
			[
				{
					label: 'edit/delete state',
				},
				'contentUri',
				'metadataHash',
				{
					label: 'comment/quote/repost/root refs',
				},
				{
					label: 'latest comment/repost/quote/bookmark/collect/reaction snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Text/metadata',
				items: [
					{
						label: 'full post text',
					},
					'contentUri',
					'metadataHash',
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'author Lens account',
					},
				],
			},
			{
				label: 'Feed',
				items: [
					'$feed',
				],
			},
			{
				label: 'Comments',
				items: [
					{
						label: 'comment posts linked to this post',
					},
				],
			},
			{
				label: 'References',
				items: [
					{
						label: 'comment/quote/repost/root post refs',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped engagement observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'post GraphQL payload',
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
			id: 'comments',
			label: 'comments',
			field: '$$comments',
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
			selection: EntityProxyResource<typeof schema, EntityType.LensPost>
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
	entityType={EntityType.LensPost}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
