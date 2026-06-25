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
		'walletId',
		'$mint',
		'unit',
	],
	content: {
		dl: [
			[
				'walletId',
				'$mint',
				'unit',
				{
					label: 'latest balance',
				},
				{
					label: 'latest proof count',
				},
			],
			[
				{
					label: 'latest active keyset count',
				},
				{
					label: 'latest pending mint/melt quote counts',
				},
				{
					label: 'latest sync time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'BlockheadCashuWalletState_TimestampView',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'BlockheadCashuWalletState_TimestampsView',
					},
				],
			},
			{
				label: 'Proofs',
				items: [
					{
						label: 'BlockheadCashuProof list',
					},
				],
			},
			{
				label: 'Tokens',
				items: [
					{
						label: 'BlockheadCashuToken list',
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
				label: 'Quotes',
				items: [
					{
						label: 'BlockheadCashuMintQuote/BlockheadCashuMeltQuote rows known to the wallet',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'proofs',
			label: 'proofs',
			field: '$$proofs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'tokens',
			label: 'tokens',
			field: '$$tokens',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'mint-quotes',
			label: 'mint quotes',
			field: '$$mintQuotes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'melt-quotes',
			label: 'melt quotes',
			field: '$$meltQuotes',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuWalletState>
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
	entityType={EntityType.BlockheadCashuWalletState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
