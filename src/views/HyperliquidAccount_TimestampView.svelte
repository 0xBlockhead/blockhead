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
				label: 'account',
			},
			{
				label: 'observed time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'observed time',
					},
					'source',
					{
						label: 'account value',
					},
					{
						label: 'total notional position',
					},
					{
						label: 'raw USD',
					},
					{
						label: 'margin used',
					},
					{
						label: 'withdrawable amount',
					},
					{
						label: 'maintenance margin',
					},
					{
						label: 'position count',
					},
					{
						label: 'spot balance count',
					},
					{
						label: 'approved builder count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'parent Hyperliquid account',
						},
					],
				},
				{
					label: 'Positions',
					items: [
						{
							label: 'clearinghouse asset positions JSON',
						},
					],
				},
				{
					label: 'Spot balances',
					items: [
						{
							label: 'spot balance rows from user state',
						},
					],
				},
				{
					label: 'Fees/staking',
					items: [
						{
							label: 'fee schedule',
						},
						{
							label: 'staking summary',
						},
					],
				},
				{
					label: 'Abstraction/builders',
					items: [
						{
							label: 'user abstraction',
						},
						{
							label: 'DEX abstraction',
						},
						{
							label: 'approved builder state',
						},
					],
				},
				{
					label: 'Borrow/lend',
					items: [
						{
							label: 'borrow/lend user state',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'info API response payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidAccount_Timestamp>
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
	entityType={EntityType.HyperliquidAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
