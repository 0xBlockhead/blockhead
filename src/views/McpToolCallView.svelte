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
		'callId',
		'$tool',
	],
	content: {
		dl: [
			[
				'$server',
				'callId',
				'$tool',
			],
			[
				{
					label: 'started/completed at',
				},
				{
					label: 'input/output hash algorithms and hashes',
				},
				{
					label: 'latest status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Tool',
				items: [
					{
						label: 'McpTool',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: 'McpToolCall_Timestamp list',
					},
				],
			},
			{
				label: 'Server',
				items: [
					{
						label: 'McpServer',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.McpToolCall>
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
	entityType={EntityType.McpToolCall}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
