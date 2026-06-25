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
		'$account',
		'$asset',
		{
			label: 'latest trustline observation',
		},
	],
	content: {
		dl: [
			[
				'$account',
				'$asset',
				{
					label: 'latest balance/limit/liability observation',
				},
				{
					label: 'latest authorization/clawback observation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Snapshots',
				items: [
					{
						label: 'timestamped trustline ledger-state observations',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'parent Stellar account',
					},
				],
			},
			{
				label: 'Asset',
				items: [
					{
						label: 'trusted Stellar asset',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon balances array',
					},
					{
						label: 'RPC trustline ledger entry',
					},
					{
						label: 'indexer account asset payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarTrustline>
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
	entityType={EntityType.StellarTrustline}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
