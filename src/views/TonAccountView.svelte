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
		'workchain',
		{
			label: 'latest account observation',
		},
	],
	content: {
		dl: [
			[
				'address',
				'workchain',
				{
					label: 'latest balance/status observation',
				},
				{
					label: 'last transaction lt',
				},
				{
					label: 'contract/interface observation',
				},
				{
					label: 'jetton balance/NFT item windows',
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
						label: 'TON transactions involving this account',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'TON messages involving this account',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'TON contract when code/interface is detected',
					},
				],
			},
			{
				label: 'Jettons',
				items: [
					{
						label: 'jetton balance observations',
					},
				],
			},
			{
				label: 'NFTs',
				items: [
					{
						label: 'TON NFT item rows',
					},
				],
			},
			{
				label: 'Account history',
				items: [
					{
						label: 'timestamped account-state observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw account-state payload',
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
			id: 'messages',
			label: 'messages',
			field: '$$messages',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'jetton-balance-timestamps',
			label: 'jetton balance timestamps',
			field: '$$jettonBalanceTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'nft-items',
			label: 'nft items',
			field: '$$nftItems',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonAccount>
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
	entityType={EntityType.TonAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
