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
		'accountId',
		{
			label: 'latest nonce/native-balance summary',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'accountId',
				{
					label: 'latest nonce/native-balance summary',
				},
				{
					label: 'asset-balance snapshot count',
				},
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Balance history',
				items: [
					{
						label: 'timestamped account-state observations',
					},
				],
			},
			{
				label: 'Asset balances',
				items: [
					{
						label: 'asset balance observations grouped by asset',
					},
				],
			},
			{
				label: 'Extrinsics',
				items: [
					{
						label: 'signed Polkadot extrinsics when indexed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node/indexer account payload fields',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'asset-balance-timestamps',
			label: 'asset balance timestamps',
			field: '$$assetBalanceTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAccount>
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
	entityType={EntityType.PolkadotAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
