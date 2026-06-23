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
				label: 'network id',
			},
			{
				label: 'protocol kind',
			},
			{
				label: 'latest discovery coverage',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network id',
					},
					'label',
					{
						label: 'protocol kind',
					},
					{
						label: 'latest observation',
					},
				],
				[
					{
						label: 'ACP programs',
					},
					{
						label: 'A2A cards',
					},
					{
						label: 'MCP servers',
					},
					{
						label: 'EIP-8004 registrations',
					},
					{
						label: 'Blockhead profiles',
					},
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
