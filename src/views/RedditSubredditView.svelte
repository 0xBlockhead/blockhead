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
			'name',
			'title',
			{
				label: 'public description',
			},
		],
		content: {
			dl: [
				[
					'name',
					'title',
					{
						label: 'public description',
					},
					{
						label: 'created time',
					},
					{
						label: 'over-18 flag',
					},
					{
						label: 'icon media',
					},
					{
						label: 'latest subscriber/active-user snapshot',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Links',
					items: [
						{
							label: 'submission/link rows',
						},
					],
				},
				{
					label: 'Metric snapshots',
					items: [
						{
							label: 'timestamped subscriber/active-user observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.RedditSubreddit>
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
	entityType={EntityType.RedditSubreddit}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
