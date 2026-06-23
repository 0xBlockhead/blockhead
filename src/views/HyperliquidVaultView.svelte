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
			{
				label: 'network',
			},
			{
				label: 'vault address',
			},
			{
				label: 'leader',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'vault address',
					},
					{
						label: 'leader',
					},
					{
						label: 'latest name',
					},
					{
						label: 'latest APR',
					},
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
					{
						label: 'timestamp count',
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
