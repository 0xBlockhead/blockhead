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
			label: 'feed address',
		},
		'owner',
		'name',
	],
	content: {
		dl: [
			[
				{
					label: 'feed address',
				},
				'owner',
				'name',
				'description',
				'createdAt',
				{
					label: 'rule summary',
				},
				'$$posts',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Posts',
				items: [
					{
						label: 'posts published to this feed',
					},
				],
			},
			{
				label: 'Owner',
				items: [
					{
						label: 'owner EVM account when resolved',
					},
				],
			},
			{
				label: 'Rules',
				items: [
					{
						label: 'feed rules JSON',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'feed GraphQL payload',
					},
					{
						label: 'feed contract events when available',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.LensFeed>
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
	entityType={EntityType.LensFeed}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
