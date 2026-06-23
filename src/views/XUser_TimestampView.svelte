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
				label: 'user',
			},
			{
				label: 'observation time',
			},
			{
				label: 'followers',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'user',
					},
					{
						label: 'observation time',
					},
					{
						label: 'followers',
					},
					{
						label: 'following',
					},
					{
						label: 'posts',
					},
					{
						label: 'listed count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'User',
					items: [
						{
							label: 'parent user identity',
						},
					],
				},
				{
					label: 'Counters',
					items: [
						{
							label: 'followers/following/posts/listed counts',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'X_Rest public_metrics',
						},
						{
							label: 'FxEmbed user counters',
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
			selection: EntityProxyResource<typeof schema, EntityType.XUser_Timestamp>
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
	entityType={EntityType.XUser_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
