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
		'$registration',
		'timestampMs',
		'active',
	],
	content: {
		dl: [
			[
				'$registration',
				'timestampMs',
				'source',
				'active',
			],
			[
				'agentUri',
				'ownerAddress',
				{
					label: 'agent wallet',
				},
				{
					label: 'block',
				},
				{
					label: 'transaction',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Registration',
				items: [
					{
						label: 'Eip8004AgentRegistration',
					},
				],
			},
			{
				label: 'On-chain evidence',
				items: [
					{
						label: 'owner/agent wallet/block/transaction',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					'agentUri',
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004AgentRegistration_Timestamp>
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
	entityType={EntityType.Eip8004AgentRegistration_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
