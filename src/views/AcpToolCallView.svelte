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
		'$promptTurn',
		'toolCallId',
		'toolName',
	],
	content: {
		dl: [
			[
				'$promptTurn',
				'toolCallId',
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
