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
				label: 'ledger',
			},
			{
				label: 'owner principal',
			},
			'subaccount',
		],
		content: {
			dl: [
				[
					{
						label: 'ledger',
					},
					{
						label: 'owner principal',
					},
					'subaccount',
					{
						label: 'observed time/source',
					},
					'balance',
					{
						label: 'allowance count',
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
					label: 'Transactions',
					items: [
						{
							label: 'ledger transactions filtered by owner/subaccount when indexed',
						},
					],
				},
				{
					label: 'Allowances',
					items: [
						{
							label: 'approve/transfer-from allowance evidence',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'icrc1_balance_of',
						},
						{
							label: 'icrc2_allowance',
						},
						{
							label: 'Rosetta',
						},
						{
							label: 'or dashboard payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpLedgerAccount_Timestamp>
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
	entityType={EntityType.IcpLedgerAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
