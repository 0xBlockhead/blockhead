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
		'claimableBalanceId',
		{
			label: 'latest state observation',
		},
		{
			label: 'claimed/deleted state',
		},
	],
	content: {
		dl: [
			[
				'claimableBalanceId',
				{
					label: 'latest asset/amount observation',
				},
				{
					label: 'latest sponsor/claimant observation',
				},
				{
					label: 'claimed transaction when known',
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
						label: 'latest ledger/source claimable-balance observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped claimable-balance observations',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'create/claim transaction effects',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon/RPC/indexer payloads',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.StellarClaimableBalance>
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
	entityType={EntityType.StellarClaimableBalance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
