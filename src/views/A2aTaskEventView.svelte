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
				label: 'task',
			},
			'sequence',
			{
				label: 'kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'task',
					},
					'sequence',
					{
						label: 'kind',
					},
					{
						label: 'timestamp',
					},
				],
				[
					'state',
					'final',
					{
						label: 'artifact',
					},
					'payload',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Task',
					items: [
						{
							label: 'A2aTask',
						},
					],
				},
				{
					label: 'Artifact',
					items: [
						{
							label: 'A2aArtifact when present',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'raw event payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aTaskEvent>
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
	entityType={EntityType.A2aTaskEvent}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
