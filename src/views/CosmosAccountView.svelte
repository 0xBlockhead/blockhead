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
			'address',
			{
				label: 'latest account-state snapshot',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'address',
					{
						label: 'latest account number/sequence',
					},
					{
						label: 'latest native-denom balance',
					},
					{
						label: 'delegation count',
					},
					{
						label: 'transaction count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account snapshots',
					items: [
						{
							label: 'timestamped account/auth state observations',
						},
					],
				},
				{
					label: 'Balances',
					items: [
						{
							label: 'timestamped account balance observations grouped by denom',
						},
					],
				},
				{
					label: 'Delegations',
					items: [
						{
							label: 'staking delegations from this account',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'Cosmos transactions involving this account when indexed',
						},
					],
				},
				{
					label: 'Contracts/modules',
					items: [
						{
							label: 'creator/admin/authority refs when linked by CosmosContract or CosmosModule',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Cosmos network',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosAccount>
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
	entityType={EntityType.CosmosAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
