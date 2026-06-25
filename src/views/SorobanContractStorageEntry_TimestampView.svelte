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
			label: 'storage entry',
		},
		'ledgerSequence',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'storage entry',
				},
				'ledgerSequence',
				'source',
				{
					label: 'observed time',
				},
				'found',
			],
			[
				'durability',
				'lastModifiedLedger',
				'liveUntilLedger',
				{
					label: 'value summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Storage entry',
				items: [
					{
						label: 'parent Soroban storage entry',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'parent Soroban contract',
					},
				],
			},
			{
				label: 'Ledger',
				items: [
					{
						label: 'Stellar ledger when resolved',
					},
				],
			},
			{
				label: 'Value',
				items: [
					{
						label: 'decoded JSON',
					},
					{
						label: 'raw XDR',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getLedgerEntries key/xdr/latestLedger payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SorobanContractStorageEntry_Timestamp>
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
	entityType={EntityType.SorobanContractStorageEntry_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
