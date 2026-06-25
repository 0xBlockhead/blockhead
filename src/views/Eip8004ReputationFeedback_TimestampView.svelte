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
		{
			label: 'client',
		},
		'feedbackIndex',
	],
	content: {
		dl: [
			[
				'$registration',
				'clientAddress',
				'feedbackIndex',
				'valueDecimals',
			],
			[
				{
					label: 'tags',
				},
				'endpoint',
				{
					label: 'feedback URI/hash',
				},
				'revoked',
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
						label: 'block/transaction',
					},
				],
			},
			{
				label: 'Off-chain evidence',
				items: [
					{
						label: 'feedback URI/hash algorithm/hash',
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004ReputationFeedback_Timestamp>
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
	entityType={EntityType.Eip8004ReputationFeedback_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
