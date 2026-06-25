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
		'runtimeId',
		'$programVersion',
		'transportKind',
	],
	content: {
		dl: [
			[
				'runtimeId',
				'$source',
				'$programVersion',
				'$programInstall',
				'transportKind',
			],
			[
				'processId',
				'initializedAt',
				{
					label: 'session refs',
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
				label: 'Sessions',
				items: [
					{
						label: 'AcpSession list',
					},
				],
			},
			{
				label: 'Health',
				items: [
					{
						label: 'AcpAgentRuntime_Timestamp list',
					},
				],
			},
			{
				label: 'Program',
				items: [
					{
						label: 'AcpAgentProgramVersion',
					},
					{
						label: 'BlockheadAgentProgramInstall',
					},
				],
			},
			{
				label: 'Local source',
				items: [
					{
						label: 'BlockheadSource',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'sessions',
			label: 'sessions',
			field: '$$sessions',
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
			selection: EntityProxyResource<typeof schema, EntityType.AcpAgentRuntime>
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
	entityType={EntityType.AcpAgentRuntime}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
