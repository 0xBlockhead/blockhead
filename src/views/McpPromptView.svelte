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
		'$server',
		'name',
	],
	content: {
		dl: [
			[
				'$server',
				'name',
				'title',
				'description',
			],
			[
				'argumentsSchema',
				{
					label: 'result refs',
				},
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
				label: 'Schema',
				items: [
					'argumentsSchema',
				],
			},
			{
				label: 'Results',
				items: [
					{
						label: 'McpPromptResult list',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'results',
			label: 'results',
			field: '$$results',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.McpPrompt>
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
	entityType={EntityType.McpPrompt}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
