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
				label: 'resource',
			},
			{
				label: 'observation time',
			},
			{
				label: 'content kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'resource',
					},
					{
						label: 'timestamp',
					},
					'source',
					{
						label: 'kind',
					},
				],
				[
					{
						label: 'URI',
					},
					{
						label: 'mime type',
					},
					'size',
					{
						label: 'blob hash algorithm/hash',
					},
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Resource',
					items: [
						{
							label: 'McpResource',
						},
					],
				},
				{
					label: 'Content',
					items: [
						{
							label: 'text/blob hash',
						},
					],
				},
				{
					label: 'Annotations',
					items: [
						{
							label: 'annotations payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpResourceContent_Timestamp>
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
	entityType={EntityType.McpResourceContent_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
