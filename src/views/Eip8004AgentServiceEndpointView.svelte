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
		'$registrationFile',
		'endpointKind',
		'endpointUrl',
	],
	content: {
		dl: [
			[
				'$registrationFile',
				'endpointKind',
				'endpointUrl',
				{
					label: 'name/version',
				},
				'protocolKind',
			],
			[
				'active',
				{
					label: 'A2A card',
				},
				'$mcpServer',
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
					'$a2aAgentCard',
					'$mcpServer',
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
	lists: [
		{
			id: 'payment-requirements',
			label: 'payment requirements',
			field: '$$paymentRequirements',
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
