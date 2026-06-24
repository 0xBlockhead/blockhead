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
			label: 'proposal',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'proposal',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'yes/abstain/no/no-with-veto counts',
				},
				{
					label: 'turnout when sourced',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Proposal',
				items: [
					{
						label: 'parent governance proposal',
					},
				],
			},
			{
				label: 'Votes',
				items: [
					{
						label: 'proposal vote records',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'live/final tally payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposalTally_Timestamp>
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
	entityType={EntityType.CosmosGovernanceProposalTally_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
