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
				label: 'AMM',
			},
			{
				label: 'ledger index',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'AMM',
					},
					{
						label: 'ledger index',
					},
					'source',
					{
						label: 'observation time',
					},
					{
						label: 'asset reserves',
					},
					{
						label: 'LP token balance',
					},
					{
						label: 'trading fee',
					},
					{
						label: 'auction slot',
					},
					{
						label: 'vote slot summary',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'AMM',
					items: [
						{
							label: 'parent AMM identity',
						},
					],
				},
				{
					label: 'Ledger',
					items: [
						{
							label: 'ledger context',
						},
					],
				},
				{
					label: 'Auction/votes',
					items: [
						{
							label: 'decoded auctionSlot',
						},
						'voteSlots',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'amm_info/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplAmm_Timestamp>
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
	entityType={EntityType.XrplAmm_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
