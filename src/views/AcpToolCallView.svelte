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
			label: 'prompt turn',
		},
		{
			label: 'tool call id',
		},
		{
			label: 'tool name',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'prompt turn',
				},
				{
					label: 'tool call id',
				},
				{
					label: 'tool/server name',
				},
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
				label: 'Prompt turn',
				items: [
					{
						label: 'AcpPromptTurn',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: 'AcpToolCall_Timestamp list',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpToolCall>
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
	entityType={EntityType.AcpToolCall}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
