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
				label: 'contract',
			},
			{
				label: 'ledger sequence',
			},
			{
				label: 'wasm hash',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'contract',
					},
					{
						label: 'ledger sequence',
					},
					'source',
					{
						label: 'observed time',
					},
					{
						label: 'found state',
					},
				],
				[
					{
						label: 'executable kind',
					},
					{
						label: 'wasm hash',
					},
					{
						label: 'linked WASM',
					},
					{
						label: 'last-modified ledger',
					},
					{
						label: 'live-until ledger',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Contract',
					items: [
						{
							label: 'parent Soroban contract',
						},
					],
				},
				{
					label: 'WASM',
					items: [
						{
							label: 'linked Soroban WASM',
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
					label: 'Source evidence',
					items: [
						{
							label: 'ContractData/ContractCode ledger entries',
						},
						{
							label: 'getLedgerEntries latestLedger payload',
						},
						{
							label: 'indexer freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.SorobanContract_Timestamp>
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
	entityType={EntityType.SorobanContract_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
