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
		'$walletState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$walletState',
				'timestampMs',
				'source',
				'balance',
				'proofCount',
			],
			[
				{
					label: 'unspent/pending/spent proof counts',
				},
				'activeKeysetCount',
				'pendingMintQuoteCount',
				'pendingMeltQuoteCount',
				'tokenCount',
			],
			[
				{
					label: 'sync time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Wallet',
				items: [
					{
						label: 'BlockheadCashuWalletStateView',
					},
				],
			},
			{
				label: 'Proof state',
				items: [
					{
						label: 'BlockheadCashuProof_Timestamp list grouped by state',
					},
				],
			},
			{
				label: 'Quotes',
				items: [
					{
						label: 'BlockheadCashuMintQuote_Timestamp',
					},
					{
						label: 'BlockheadCashuMeltQuote_Timestamp lists',
					},
				],
			},
			{
				label: 'Keysets',
				items: [
					{
						label: 'CashuKeyset_Timestamp list for active keysets',
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
				label: 'Source evidence',
				items: [
					{
						label: 'local proof store',
					},
					{
						label: 'NUT-07 check-state results',
					},
					{
						label: 'NUT-17 websocket notifications',
					},
					{
						label: 'quote-state payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuWalletState_Timestamp>
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
	entityType={EntityType.BlockheadCashuWalletState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
