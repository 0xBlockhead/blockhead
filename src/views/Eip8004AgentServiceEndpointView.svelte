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
				label: 'registration file',
			},
			{
				label: 'endpoint kind',
			},
			{
				label: 'endpoint URL',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'registration file',
					},
					{
						label: 'endpoint kind',
					},
					{
						label: 'endpoint URL',
					},
					{
						label: 'name/version',
					},
					{
						label: 'protocol kind',
					},
				],
				[
					'active',
					{
						label: 'A2A card',
					},
					{
						label: 'MCP server',
					},
					{
						label: 'payment requirement refs',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Registration file',
					items: [
						{
							label: 'Eip8004AgentRegistrationFile',
						},
					],
				},
				{
					label: 'Protocol refs',
					items: [
						{
							label: 'A2aAgentCard',
						},
						{
							label: 'McpServer',
						},
					],
				},
				{
					label: 'Payment',
					items: [
						{
							label: 'AgentPaymentRequirement_Timestamp list',
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004AgentServiceEndpoint>
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
	entityType={EntityType.Eip8004AgentServiceEndpoint}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
