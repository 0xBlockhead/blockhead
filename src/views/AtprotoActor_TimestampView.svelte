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
		'$actor',
		'timestampMs',
		{
			label: 'followers',
		},
	],
	content: {
		dl: [
			[
				'$actor',
				'timestampMs',
				{
					label: 'followers',
				},
				{
					label: 'follows',
				},
				'postsCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Actor',
				items: [
					{
						label: 'parent AT Protocol actor identity',
					},
				],
			},
			{
				label: 'Social counters',
				items: [
					{
						label: 'followers',
					},
					{
						label: 'follows',
					},
					'postsCount',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'app.bsky.actor.getProfile AppView stats payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoActor_Timestamp>
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
	entityType={EntityType.AtprotoActor_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
