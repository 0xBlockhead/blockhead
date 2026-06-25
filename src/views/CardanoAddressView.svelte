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
		'address',
		'addressKind',
		'paymentCredential',
	],
	content: {
		dl: [
			[
				'address',
				'addressKind',
				'paymentCredential',
				'$stakeCredential',
				'$stakeCredential',
				{
					label: 'latest lovelace/asset/UTXO snapshot',
				},
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'UTXOs',
				items: [
					{
						label: 'Cardano transaction outputs at this address',
					},
				],
			},
			{
				label: 'Snapshots',
				items: [
					{
						label: 'timestamped address balance/count observations',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Cardano transactions when indexed',
					},
				],
			},
			{
				label: 'Stake credential',
				items: [
					{
						label: 'linked Cardano stake credential',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoAddress>
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
	entityType={EntityType.CardanoAddress}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
