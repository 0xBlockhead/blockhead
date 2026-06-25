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
		'vaultAddress',
		'$leader',
	],
	content: {
		dl: [
			[
				'$network',
				'vaultAddress',
				'$leader',
				{
					label: 'latest name',
				},
				{
					label: 'latest APR',
				},
			],
			[
				{
					label: 'latest leader fraction/commission',
				},
				{
					label: 'latest distributable/withdrawable amounts',
				},
				{
					label: 'latest closed/deposit flags',
				},
				{
					label: 'follower count',
				},
				{
					label: 'equity observation count',
				},
			],
			[
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
						label: 'latest vault-detail observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped vault-detail observations',
					},
				],
			},
			{
				label: 'Leader',
				items: [
					{
						label: 'linked Hyperliquid leader account',
					},
				],
			},
			{
				label: 'Portfolio',
				items: [
					{
						label: 'account value',
					},
					{
						label: 'PnL history buckets from latest vaultDetails',
					},
				],
			},
			{
				label: 'Followers',
				items: [
					{
						label: 'follower equity/PnL rows from latest vaultDetails',
					},
				],
			},
			{
				label: 'User equities',
				items: [
					{
						label: 'account/vault equity observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'equities',
			label: 'equities',
			field: '$$equities',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidVault>
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
	entityType={EntityType.HyperliquidVault}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
