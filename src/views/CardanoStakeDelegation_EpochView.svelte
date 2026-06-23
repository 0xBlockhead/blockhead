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
				label: 'stake credential',
			},
			'epoch',
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'stake credential',
					},
					'epoch',
					'source',
					{
						label: 'stake pool',
					},
					{
						label: 'DRep',
					},
					{
						label: 'active stake',
					},
					{
						label: 'reward amount',
					},
					{
						label: 'withdrawal amount',
					},
					{
						label: 'registered flag',
					},
					{
						label: 'deregistered flag',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Stake credential',
					items: [
						{
							label: 'parent Cardano stake credential',
						},
					],
				},
				{
					label: 'Pool',
					items: [
						{
							label: 'delegated Cardano stake pool',
						},
					],
				},
				{
					label: 'DRep',
					items: [
						{
							label: 'delegated Cardano DRep',
						},
					],
				},
				{
					label: 'Epoch state',
					items: [
						{
							label: 'active stake/reward/withdrawal fields',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'ledger/indexer epoch query context',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoStakeDelegation_Epoch>
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
	entityType={EntityType.CardanoStakeDelegation_Epoch}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
