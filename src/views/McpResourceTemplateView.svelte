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
			label: 'URI template',
		},
		'name',
	],
	content: {
		dl: [
			[
				{
					label: 'server',
				},
				{
					label: 'URI template',
				},
				'name',
				'title',
			],
			[
				'description',
				{
					label: 'mime type',
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
				label: 'Annotations',
				items: [
					{
						label: 'annotations JSON',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpResourceTemplate>
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
	entityType={EntityType.McpResourceTemplate}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
