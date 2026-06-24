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
			label: 'account role',
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
					label: 'account role',
				},
				{
					label: 'master account',
				},
				{
					label: 'agent account',
				},
				{
					label: 'latest account value',
				},
				{
					label: 'latest withdrawable amount',
				},
				{
					label: 'latest spot balance count',
				},
				{
					label: 'latest open order count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account state',
				items: [
					{
						label: 'timestamped clearinghouse/user-state observations',
					},
				],
			},
			{
				label: 'Orders',
				items: [
					{
						label: 'Hyperliquid order rows',
					},
				],
			},
			{
				label: 'Fills',
				items: [
					{
						label: 'Hyperliquid fill rows',
					},
				],
			},
			{
				label: 'Vault equities',
				items: [
					{
						label: 'timestamped vault equity observations',
					},
				],
			},
			{
				label: 'Master/agent',
				items: [
					{
						label: 'Hyperliquid account role links',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'HyperEVM transactions when source context provides activity',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidAccount>
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
	entityType={EntityType.HyperliquidAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
