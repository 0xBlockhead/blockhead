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
			'epoch',
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'proposal',
					},
					'epoch',
					'source',
					'slot',
					'status',
					{
						label: 'ratified/enacted/expired/dropped epochs',
					},
					{
						label: 'yes/no/abstain stake',
					},
					{
						label: 'DRep stake totals',
					},
					{
						label: 'SPO stake totals',
					},
					{
						label: 'committee vote counts',
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
					label: 'Vote totals',
					items: [
						{
							label: 'DRep/SPO/committee aggregation',
						},
					],
				},
				{
					label: 'Votes',
					items: [
						{
							label: 'governance votes for the proposal',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'governanceProposals/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoGovernanceProposal_Timestamp>
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
	entityType={EntityType.CardanoGovernanceProposal_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
