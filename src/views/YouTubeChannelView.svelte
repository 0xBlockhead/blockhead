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
				label: 'channel id',
			},
			{
				label: 'latest title',
			},
			{
				label: 'latest description',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'channel id',
					},
					{
						label: 'published date',
					},
					{
						label: 'latest title',
					},
					{
						label: 'latest description',
					},
					{
						label: 'latest custom URL',
					},
					{
						label: 'latest icon media',
					},
					{
						label: 'latest subscriber/video/view snapshot',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest metadata',
					items: [
						{
							label: 'latest channel metadata observation',
						},
					],
				},
				{
					label: 'Videos',
					items: [
						{
							label: 'channel videos',
						},
					],
				},
				{
					label: 'Playlists',
					items: [
						{
							label: 'channel playlists',
						},
					],
				},
				{
					label: 'Metric snapshots',
					items: [
						{
							label: 'channel metric observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.YouTubeChannel>
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
	entityType={EntityType.YouTubeChannel}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
