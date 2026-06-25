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
		'networkId',
		'protocolKind',
		{
			label: 'latest discovery coverage',
		},
	],
	content: {
		dl: [
			[
				'networkId',
				'label',
				'protocolKind',
				{
					label: 'latest observation',
				},
			],
			[
				'$$acpPrograms',
				'$$a2aCards',
				'$$mcpServers',
				'$$eip8004Registrations',
				'$$blockheadProfiles',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'ACP',
				items: [
					{
						label: 'AcpAgentProgram list',
					},
				],
			},
			{
				label: 'A2A',
				items: [
					{
						label: 'A2aAgentCard/A2aAgentService lists',
					},
				],
			},
			{
				label: 'MCP',
				items: [
					{
						label: 'McpServer list',
					},
				],
			},
			{
				label: 'EIP-8004',
				items: [
					{
						label: 'Eip8004AgentRegistration list',
					},
				],
			},
			{
				label: 'Local profiles',
				items: [
					{
						label: 'BlockheadAgentProfile list',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: '_GlobalAgentNetwork_Timestamp list',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'acp-programs',
			label: 'acp programs',
			field: '$$acpPrograms',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'a2a-cards',
			label: 'a2a cards',
			field: '$$a2aCards',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'mcp-servers',
			label: 'mcp servers',
			field: '$$mcpServers',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'eip8004-registrations',
			label: 'eip8004 registrations',
			field: '$$eip8004Registrations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-profiles',
			label: 'blockhead profiles',
			field: '$$blockheadProfiles',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAgentNetwork>
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
	entityType={EntityType._GlobalAgentNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
