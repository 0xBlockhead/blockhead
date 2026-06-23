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
				label: 'post id',
			},
			{
				label: 'latest text',
			},
			{
				label: 'created time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'post id',
					},
					{
						label: 'created time',
					},
					{
						label: 'author',
					},
					{
						label: 'conversation id',
					},
					{
						label: 'reply/quote refs',
					},
					{
						label: 'latest post URL',
					},
					{
						label: 'latest media attachments',
					},
					{
						label: 'latest like/repost/reply/quote snapshot',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest content',
					items: [
						{
							label: 'latest content observation by timestamp/source',
						},
					],
				},
				{
					label: 'Thread refs',
					items: [
						{
							label: 'reply/quote/conversation facets',
						},
					],
				},
				{
					label: 'Author',
					items: [
						{
							label: 'author profile',
						},
					],
				},
				{
					label: 'Media',
					items: [
						{
							label: 'media list from latest timestamp',
						},
					],
				},
				{
					label: 'Metric snapshots',
					items: [
						{
							label: 'post metric observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.XPost>
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
	entityType={EntityType.XPost}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
