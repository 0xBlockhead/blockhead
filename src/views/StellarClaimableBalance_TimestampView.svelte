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
		'$claimableBalance',
		'$asset',
		'amount',
	],
	content: {
		dl: [
			[
				'$claimableBalance',
				'timestampMs',
				'source',
				'ledgerSequence',
				'$asset',
				'amount',
			],
			[
				'sponsor',
				'claimants',
				{
					label: 'claimed transaction',
				},
				'deleted',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Claimable balance',
				items: [
					{
						label: 'parent Stellar claimable balance',
					},
				],
			},
			{
				label: 'Claimants',
				items: [
					{
						label: 'destination/predicate table',
					},
				],
			},
			{
				label: 'Asset',
				items: [
					{
						label: 'claimable asset',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'create/claim transaction evidence',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon claimable balance object',
					},
					{
						label: 'RPC ledger entry payload',
					},
					{
						label: 'explorer/indexer freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarClaimableBalance_Timestamp>
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
	entityType={EntityType.StellarClaimableBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
