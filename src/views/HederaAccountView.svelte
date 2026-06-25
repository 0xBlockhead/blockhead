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
		'accountId',
		{
			label: 'latest alias',
		},
		{
			label: 'latest EVM address',
		},
	],
	content: {
		dl: [
			[
				'accountId',
				{
					label: 'latest alias',
				},
				{
					label: 'latest EVM address',
				},
				{
					label: 'receiver signature requirement',
				},
				{
					label: 'memo',
				},
			],
			[
				{
					label: 'latest balance',
				},
				{
					label: 'staking state',
				},
				'$$allowances',
				{
					label: 'token association count',
				},
				'$$nfts',
			],
			[
				{
					label: 'deleted flag',
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
						label: 'latest account-info observation',
					},
				],
			},
			{
				label: 'Account history',
				items: [
					{
						label: 'timestamped account-info observations',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Hedera transactions involving this account',
					},
				],
			},
			{
				label: 'HTS token associations',
				items: [
					{
						label: 'token association rows',
					},
				],
			},
			{
				label: 'NFTs',
				items: [
					{
						label: 'HTS NFT serial rows',
					},
				],
			},
			{
				label: 'Allowances',
				items: [
					{
						label: 'Hedera allowance rows',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'allowances',
			label: 'allowances',
			field: '$$allowances',
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
			id: 'nfts',
			label: 'nfts',
			field: '$$nfts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaAccount>
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
	entityType={EntityType.HederaAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
