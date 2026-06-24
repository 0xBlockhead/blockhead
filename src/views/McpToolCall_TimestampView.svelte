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
			label: 'tool call',
		},
		{
			label: 'observation time',
		},
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'tool call',
				},
				{
					label: 'timestamp',
				},
				'source',
				'status',
				{
					label: 'is error',
				},
			],
			[
				{
					label: 'latency',
				},
				{
					label: 'protocol error',
				},
				'content',
				{
					label: 'structured content',
				},
				{
					label: 'resource links',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Tool call',
				items: [
					{
						label: 'McpToolCall',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'content/structuredContent/resource/error payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpToolCall_Timestamp>
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
	entityType={EntityType.McpToolCall_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
