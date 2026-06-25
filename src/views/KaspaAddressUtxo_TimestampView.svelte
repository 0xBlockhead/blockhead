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
		'outpointTransactionId',
		'outpointIndex',
	],
	content: {
		dl: [
			[
				'$address',
				'outpointTransactionId',
				'outpointIndex',
				{
					label: 'observed time/source',
				},
				{
					label: 'amount',
				},
			],
			[
				'blockDaaScore',
				{
					label: 'coinbase flag',
				},
				'$output',
				{
					label: 'spending transaction when known',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Address',
				items: [
					{
						label: 'parent Kaspa address',
					},
				],
			},
			{
				label: 'Output',
				items: [
					{
						label: 'linked UTXO output',
					},
				],
			},
			{
				label: 'Spending transaction',
				items: [
					{
						label: 'Kaspa transaction when spent',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getUtxosByAddresses or indexer UTXO payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaAddressUtxo_Timestamp>
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
	entityType={EntityType.KaspaAddressUtxo_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
