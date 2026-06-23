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
				label: 'channel',
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
						label: 'channel',
					},
					{
						label: 'observation time',
					},
					{
						label: 'follower count',
					},
					{
						label: 'member count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Channel',
					items: [
						{
							label: 'parent Farcaster channel',
						},
					],
				},
				{
					label: 'Membership',
					items: [
						{
							label: 'follower count',
						},
						{
							label: 'member count',
						},
					],
				},
				{
					label: 'History',
					items: [
						{
							label: 'timestamped channel metric observations',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Farcaster channel payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterChannel_Timestamp>
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
	entityType={EntityType.FarcasterChannel_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
