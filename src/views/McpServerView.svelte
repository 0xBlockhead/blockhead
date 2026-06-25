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
		'serverKey',
		'transportKind',
		{
			label: 'endpoint',
		},
	],
	content: {
		dl: [
			[
				'serverKey',
				'$source',
				'$packageVersion',
				'transportKind',
			],
			[
				'endpointUrl',
				{
					label: 'tool/resource/template/prompt refs',
				},
				{
					label: 'latest health',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Tools',
				items: [
					{
						label: 'McpTool list',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'McpResource list',
					},
				],
			},
			{
				label: 'Resource templates',
				items: [
					{
						label: 'McpResourceTemplate list',
					},
				],
			},
			{
				label: 'Prompts',
				items: [
					{
						label: 'McpPrompt list',
					},
				],
			},
			{
				label: 'Health',
				items: [
					{
						label: 'McpServer_Timestamp list',
					},
				],
			},
			{
				label: 'Package',
				items: [
					{
						label: 'McpServerPackageVersion',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'tools',
			label: 'tools',
			field: '$$tools',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'resources',
			label: 'resources',
			field: '$$resources',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'resource-templates',
			label: 'resource templates',
			field: '$$resourceTemplates',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'prompts',
			label: 'prompts',
			field: '$$prompts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpServer>
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
	entityType={EntityType.McpServer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
