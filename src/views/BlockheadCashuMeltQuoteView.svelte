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
		'$mint',
		'method',
		'quoteId',
	],
	content: {
		dl: [
			[
				'$mint',
				'method',
				'quoteId',
				'request',
				'amount',
			],
			[
				'unit',
				'feeReserve',
				{
					label: 'latest observed state',
				},
				{
					label: 'latest expiry',
				},
				{
					label: 'payment preimage status',
				},
			],
			[
				'$walletState',
				'$$inputProofs',
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'BlockheadCashuMeltQuote_TimestampView',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'BlockheadCashuMeltQuote_TimestampsView',
					},
				],
			},
			{
				label: 'Mint',
				items: [
					{
						label: 'CashuMintView',
					},
				],
			},
			{
				label: 'Request',
				items: [
					{
						label: 'BOLT11/BOLT12/onchain request text',
					},
				],
			},
			{
				label: 'Proof inputs',
				items: [
					{
						label: 'BlockheadCashuProof list supplied by the local wallet',
					},
				],
			},
			{
				label: 'Wallet',
				items: [
					{
						label: 'BlockheadCashuWalletStateView',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'input-proofs',
			label: 'input proofs',
			field: '$$inputProofs',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuMeltQuote>
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
	entityType={EntityType.BlockheadCashuMeltQuote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
