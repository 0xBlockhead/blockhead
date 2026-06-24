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
			label: 'follower count',
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
					label: 'follower count',
				},
				{
					label: 'following count',
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
						label: 'parent Farcaster user',
					},
				],
			},
			{
				label: 'Social graph counters',
				items: [
					{
						label: 'follower count',
					},
					{
						label: 'following count',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'timestamped user metric observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Neynar/Snapchain profile payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterUser_Timestamp>
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
	entityType={EntityType.FarcasterUser_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
