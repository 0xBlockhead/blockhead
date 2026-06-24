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
			label: 'DID',
		},
		'handle',
		{
			label: 'display name',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'DID',
				},
				'handle',
				{
					label: 'display name',
				},
				'description',
				{
					label: 'indexed time',
				},
				{
					label: 'icon/banner',
				},
			],
			[
				{
					label: 'latest follower/follow/post snapshot',
				},
				{
					label: 'post count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Profile',
				items: [
					{
						label: 'display name',
					},
					'description',
					{
						label: 'icon',
					},
					{
						label: 'banner',
					},
					{
						label: 'indexed time',
					},
				],
			},
			{
				label: 'Metric snapshots',
				items: [
					{
						label: 'timestamped follower/follow/post counts',
					},
				],
			},
			{
				label: 'Posts',
				items: [
					{
						label: 'posts authored by this actor',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'app.bsky.actor.getProfile actor parameter by DID or handle',
					},
					{
						label: 'resolved DID/current handle tuple',
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
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoActor>
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
	entityType={EntityType.AtprotoActor}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
