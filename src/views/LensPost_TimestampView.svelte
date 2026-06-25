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
		'$post',
		'timestampMs',
		'commentCount',
	],
	content: {
		dl: [
			[
				'$post',
				'timestampMs',
				'commentCount',
				'repostCount',
				'quoteCount',
			],
			[
				'bookmarkCount',
				'collectCount',
				'reactionCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Post',
				items: [
					{
						label: 'LensPost',
					},
				],
			},
			{
				label: 'Engagement',
				items: [
					{
						label: 'comment/repost/quote/bookmark/collect/reaction counts',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'LensPost_Timestamp list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Lens GraphQL post stats payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LensPost_Timestamp>
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
	entityType={EntityType.LensPost_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
