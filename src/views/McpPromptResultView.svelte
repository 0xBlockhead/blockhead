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
				label: 'prompt',
			},
			{
				label: 'arguments hash',
			},
			{
				label: 'observation time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'prompt',
					},
					{
						label: 'arguments hash algorithm/hash',
					},
					{
						label: 'timestamp',
					},
					'source',
				],
				[
					'description',
					'messages',
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Prompt',
					items: [
						{
							label: 'McpPrompt',
						},
					],
				},
				{
					label: 'Rendered messages',
					items: [
						{
							label: 'messages payload',
						},
					],
				},
				{
					label: 'Raw',
					items: [
						{
							label: 'raw provider payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.McpPromptResult>
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
	entityType={EntityType.McpPromptResult}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
