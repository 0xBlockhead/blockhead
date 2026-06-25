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
		'sessionId',
		'$runtime',
		{
			label: 'workspace',
		},
	],
	content: {
		dl: [
			[
				'sessionId',
				'$runtime',
				{
					label: 'created/closed/deleted at',
				},
				'workspaceUri',
			],
			[
				'mode',
				'listed',
				'status',
				{
					label: 'loaded-from session',
				},
				{
					label: 'prompt turn/update/terminal refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Prompt turns',
				items: [
					{
						label: 'AcpPromptTurn list',
					},
				],
			},
			{
				label: 'Updates',
				items: [
					{
						label: 'AcpSessionUpdate list',
					},
				],
			},
			{
				label: 'Terminals',
				items: [
					{
						label: 'AcpTerminal list',
					},
				],
			},
			{
				label: 'Runtime',
				items: [
					{
						label: 'AcpAgentRuntime',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'prompt-turns',
			label: 'prompt turns',
			field: '$$promptTurns',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'updates',
			label: 'updates',
			field: '$$updates',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'terminals',
			label: 'terminals',
			field: '$$terminals',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpSession>
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
	entityType={EntityType.AcpSession}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
