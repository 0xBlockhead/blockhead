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
				label: 'AMM account',
			},
			{
				label: 'asset pair',
			},
			{
				label: 'latest trading fee',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'AMM account',
					},
					{
						label: 'asset pair',
					},
					{
						label: 'LP token currency',
					},
					{
						label: 'latest trading fee',
					},
					{
						label: 'latest reserve snapshot',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Snapshots',
					items: [
						{
							label: 'ledger-indexed AMM observations',
						},
					],
				},
				{
					label: 'Ledger entry',
					items: [
						{
							label: 'ledger entry from latest snapshot',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'AMMCreate/AMMDeposit/AMMWithdraw/AMMVote/AMMBid transactions',
						},
					],
				},
				{
					label: 'Trust lines',
					items: [
						{
							label: 'LP token holder trust lines when indexed',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplAmm>
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
	entityType={EntityType.XrplAmm}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
