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
				label: 'account',
			},
			{
				label: 'asset type',
			},
			{
				label: 'ledger version',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'asset type',
					},
					{
						label: 'ledger version',
					},
					'source',
					{
						label: 'observation time',
					},
					'amount',
					{
						label: 'coin type when resolved',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'parent Aptos account',
						},
					],
				},
				{
					label: 'Balance resource',
					items: [
						{
							label: 'matching CoinStore/FungibleAsset resource when resolved',
						},
					],
				},
				{
					label: 'History',
					items: [
						{
							label: 'same account/asset snapshots',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'fullnode /accounts/{address}/balance/{asset_type}',
						},
						{
							label: 'indexer balance payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosCoinBalance_Timestamp>
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
	entityType={EntityType.AptosCoinBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
