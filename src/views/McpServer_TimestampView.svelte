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
		'timestampMs',
		'health',
	],
	content: {
		dl: [
			[
				'$server',
				'timestampMs',
				'source',
				'health',
				'protocolVersion',
			],
			[
				{
					label: 'capabilities',
				},
				{
					label: 'listChanged/subscribe flags',
				},
				{
					label: 'tool/resource/prompt counts',
				},
				{
					label: 'cursor',
				},
				'error',
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
				label: 'Capabilities',
				items: [
					{
						label: 'server capabilities and feature flags',
					},
				],
			},
			{
				label: 'Counts',
				items: [
					{
						label: 'scoped tool/resource/prompt counts',
					},
				],
			},
			{
				label: 'Error',
				items: [
					{
						label: 'error field',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpServer_Timestamp>
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
	entityType={EntityType.McpServer_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
