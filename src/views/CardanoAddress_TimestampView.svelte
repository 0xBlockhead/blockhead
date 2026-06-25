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
		'$address',
		'blockSlot',
		'source',
	],
	content: {
		dl: [
			[
				'$address',
				'blockSlot',
				'source',
				'timestampMs',
				'blockHash',
			],
			[
				'lovelaceBalance',
				'nativeAssetCount',
				'utxoCount',
				'transactionCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Address',
				items: [
					{
						label: 'parent Cardano address',
					},
				],
			},
			{
				label: 'UTXO set',
				items: [
					{
						label: 'Cardano transaction outputs for the same observation when sourceable',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Cardano transactions',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'indexer/node query context',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoAddress_Timestamp>
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
	entityType={EntityType.CardanoAddress_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
