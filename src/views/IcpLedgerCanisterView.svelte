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
			label: 'canister',
		},
		{
			label: 'standard',
		},
		{
			label: 'latest symbol',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'canister',
				},
				{
					label: 'standard',
				},
				{
					label: 'latest symbol',
				},
				{
					label: 'latest name',
				},
				{
					label: 'decimals',
				},
				{
					label: 'fee',
				},
				{
					label: 'archive count',
				},
				{
					label: 'latest block index',
				},
				{
					label: 'account observation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ledger state history',
				items: [
					{
						label: 'timestamped ledger metadata/archive observations',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'ledger-local block rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'ledger transaction rows',
					},
				],
			},
			{
				label: 'Account balances',
				items: [
					{
						label: 'account balance observations',
					},
				],
			},
			{
				label: 'Archive canisters',
				items: [
					{
						label: 'canister refs from latest timestamp',
					},
				],
			},
			{
				label: 'Methods',
				items: [
					{
						label: 'canister method rows exposed by ledger interface',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'ledger metadata',
					},
					{
						label: 'supported-standard payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpLedgerCanister>
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
	entityType={EntityType.IcpLedgerCanister}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
