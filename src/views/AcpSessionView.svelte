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
			label: 'session id',
		},
		{
			label: 'runtime',
		},
		{
			label: 'workspace',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'session id',
				},
				{
					label: 'runtime',
				},
				{
					label: 'created/closed/deleted at',
				},
				{
					label: 'workspace URI',
				},
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
