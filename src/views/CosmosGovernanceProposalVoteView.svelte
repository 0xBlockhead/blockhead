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
				label: 'voter',
			},
			{
				label: 'latest option',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'proposal',
					},
					{
						label: 'voter',
					},
					{
						label: 'latest option/weight',
					},
					{
						label: 'latest vote time',
					},
					{
						label: 'metadata presence',
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
					label: 'Voter',
					items: [
						{
							label: 'voter Cosmos account',
						},
					],
				},
				{
					label: 'Vote observations',
					items: [
						{
							label: 'timestamped option/weight rows',
						},
					],
				},
				{
					label: 'Weighted options',
					items: [
						{
							label: 'raw weighted-vote JSON when present',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'x/gov vote payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposalVote>
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
	entityType={EntityType.CosmosGovernanceProposalVote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
