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
		{
			label: 'author',
		},
		{
			label: 'feed',
		},
	],
	content: {
		dl: [
			[
				'id',
				{
					label: 'author',
				},
				{
					label: 'feed',
				},
				{
					label: 'text preview',
				},
				'timestamp',
				{
					label: 'edit/delete state',
				},
				{
					label: 'content URI',
				},
				{
					label: 'metadata hash',
				},
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
					{
						label: 'content URI',
					},
					{
						label: 'metadata hash',
					},
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
					{
						label: 'parent feed',
					},
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
