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
		'operationKind',
		'$ledger',
		'$block',
	],
	content: {
		dl: [
			[
				'operationKind',
				'$ledger',
				'$block',
				'transactionHash',
				'amount',
			],
			[
				'fee',
				{
					label: 'from/to/spender',
				},
				'memo',
				{
					label: 'created-at time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ledger',
				items: [
					{
						label: 'parent ICP ledger canister',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'parent ledger block',
					},
				],
			},
			{
				label: 'Related accounts',
				items: [
					{
						label: 'account balance observations for from/to/spender accounts',
					},
				],
			},
			{
				label: 'Rosetta operations',
				items: [
					{
						label: 'operation list when sourced',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw ledger transaction payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpLedgerTransaction>
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
	entityType={EntityType.IcpLedgerTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
