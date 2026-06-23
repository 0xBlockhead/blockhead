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
				label: 'depositor',
			},
			'denom',
		],
		content: {
			dl: [
				[
					{
						label: 'proposal',
					},
					{
						label: 'depositor',
					},
					'denom',
					{
						label: 'latest amount/deposit time',
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
					label: 'Depositor',
					items: [
						{
							label: 'depositor Cosmos account',
						},
					],
				},
				{
					label: 'Denom',
					items: [
						{
							label: 'deposit denom when resolved',
						},
					],
				},
				{
					label: 'Deposit observations',
					items: [
						{
							label: 'timestamped amount/source rows',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'x/gov deposit payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosGovernanceProposalDeposit>
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
	entityType={EntityType.CosmosGovernanceProposalDeposit}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
