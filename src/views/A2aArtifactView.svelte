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
			{
				label: 'artifact id',
			},
			'name',
		],
		content: {
			dl: [
				[
					{
						label: 'task',
					},
					{
						label: 'artifact id',
					},
					'name',
					{
						label: 'created at',
					},
				],
				[
					{
						label: 'AI artifact ref',
					},
					{
						label: 'part refs',
					},
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
					label: 'Parts',
					items: [
						{
							label: 'A2aMessagePart list',
						},
					],
				},
				{
					label: 'Artifact',
					items: [
						{
							label: 'AiArtifact when materialized',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aArtifact>
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
	entityType={EntityType.A2aArtifact}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
