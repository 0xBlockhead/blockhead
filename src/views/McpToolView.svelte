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
				label: 'server',
			},
			{
				label: 'tool name',
			},
			'title',
		],
		content: {
			dl: [
				[
					{
						label: 'server',
					},
					'name',
					'title',
				],
				[
					'description',
					{
						label: 'input/output schemas',
					},
					'annotations',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Server',
					items: [
						{
							label: 'McpServer',
						},
					],
				},
				{
					label: 'Schemas',
					items: [
						{
							label: 'input/output schemas',
						},
					],
				},
				{
					label: 'Calls',
					items: [
						{
							label: 'McpToolCall list',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpTool>
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
	entityType={EntityType.McpTool}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
