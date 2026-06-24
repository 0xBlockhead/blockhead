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
		'namespace',
		{
			label: 'chain/registry',
		},
		{
			label: 'agent id',
		},
	],
	content: {
		dl: [
			[
				'namespace',
				{
					label: 'chain id',
				},
				{
					label: 'identity registry',
				},
				{
					label: 'agent id',
				},
			],
			[
				{
					label: 'EVM NFT ref',
				},
				{
					label: 'latest registry observation',
				},
				{
					label: 'file refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Registry observations',
				items: [
					{
						label: 'Eip8004AgentRegistration_Timestamp list',
					},
				],
			},
			{
				label: 'Registration files',
				items: [
					{
						label: 'Eip8004AgentRegistrationFile list',
					},
				],
			},
			{
				label: 'EVM NFT',
				items: [
					{
						label: 'EvmNft',
					},
				],
			},
			{
				label: 'Claims',
				items: [
					{
						label: 'AiRelationshipClaim list',
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004AgentRegistration>
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
	entityType={EntityType.Eip8004AgentRegistration}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
