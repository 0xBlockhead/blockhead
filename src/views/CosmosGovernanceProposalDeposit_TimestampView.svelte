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
			label: 'deposit',
		},
		{
			label: 'observation time',
		},
		'amount',
	],
	content: {
		dl: [
			[
				{
					label: 'deposit',
				},
				{
					label: 'observation time',
				},
				'source',
				'amount',
				{
					label: 'deposit time when sourced',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Deposit',
				items: [
					{
						label: 'parent proposal/depositor/denom row',
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
				label: 'Source evidence',
				items: [
					{
						label: 'SDK/indexer deposit payload',
					},
					{
						label: 'pagination/window context when retained',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposalDeposit_Timestamp>
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
	entityType={EntityType.CosmosGovernanceProposalDeposit_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
