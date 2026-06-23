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
				label: 'vote',
			},
			{
				label: 'observation time',
			},
			'option',
		],
		content: {
			dl: [
				[
					{
						label: 'vote',
					},
					{
						label: 'observation time',
					},
					'source',
					'option',
					'weight',
					{
						label: 'metadata presence',
					},
					{
						label: 'vote time when sourced',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Vote',
					items: [
						{
							label: 'parent proposal/voter row',
						},
					],
				},
				{
					label: 'Proposal',
					items: [
						{
							label: 'parent governance proposal',
						},
					],
				},
				{
					label: 'Weighted options',
					items: [
						{
							label: 'weighted vote payload when exposed',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'SDK/indexer vote payload',
						},
						{
							label: 'module-version option mapping',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposalVote_Timestamp>
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
	entityType={EntityType.CosmosGovernanceProposalVote_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
