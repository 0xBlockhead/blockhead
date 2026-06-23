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
				label: 'actor',
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
						label: 'actor',
					},
					{
						label: 'observation time',
					},
					{
						label: 'followers count',
					},
					{
						label: 'following count',
					},
					{
						label: 'statuses count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Actor',
					items: [
						{
							label: 'parent ActivityPub actor identity',
						},
					],
				},
				{
					label: 'Counters',
					items: [
						{
							label: 'followers/following/statuses counts',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Mastodon/Fedi account counters',
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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubActor_Timestamp>
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
	entityType={EntityType.ActivityPubActor_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
