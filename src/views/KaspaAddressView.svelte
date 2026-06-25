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
		'$network',
		'address',
		{
			label: 'latest balance',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'address',
				{
					label: 'latest balance',
				},
				{
					label: 'latest UTXO count',
				},
				'$$transactions',
				{
					label: 'source freshness',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transactions',
				items: [
					{
						label: 'Kaspa transaction rows involving this address',
					},
				],
			},
			{
				label: 'UTXOs',
				items: [
					{
						label: 'address UTXO observations grouped by outpoint',
					},
				],
			},
			{
				label: 'Balance snapshots',
				items: [
					{
						label: 'timestamped balance observations',
					},
				],
			},
			{
				label: 'Related outputs',
				items: [
					{
						label: 'resolved UTXO outputs',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node/indexer address payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'utxos',
			label: 'utxos',
			field: '$$utxos',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaAddress>
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
	entityType={EntityType.KaspaAddress}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
