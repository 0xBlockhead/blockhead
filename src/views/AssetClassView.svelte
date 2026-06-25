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
		'$assetInstance',
		'classKey',
		'classKind',
	],
	content: {
		dl: [
			[
				'$assetInstance',
				'classKey',
				'classKind',
				'label',
				'slot',
			],
			[
				'partition',
				'series',
				'maturityMs',
				'valueDecimals',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Objects',
				items: [
					{
						label: 'asset objects under this class',
					},
				],
			},
			{
				label: 'Ledger supply',
				items: [
					{
						label: 'ledger-coordinate supply observations',
					},
				],
			},
			{
				label: 'Methodology supply',
				items: [
					{
						label: 'provider-clocked supply methodology observations',
					},
				],
			},
			{
				label: 'Rights',
				items: [
					{
						label: 'UsageRight_Timestamp or restriction rows when source-backed',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'objects',
			label: 'objects',
			field: '$$objects',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'supply-ledger-states',
			label: 'supply ledger states',
			field: '$$supplyLedgerStates',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'supply-timestamps',
			label: 'supply timestamps',
			field: '$$supplyTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AssetClass>
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
	entityType={EntityType.AssetClass}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
