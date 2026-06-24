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
			label: 'icon/name from actor ENS/blockie',
		},
		{
			label: 'network icon',
		},
		{
			label: 'address on network',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'icon/name from actor ENS/blockie',
				},
				{
					label: 'network icon',
				},
				{
					label: 'address on network',
				},
				{
					label: 'latest activity/count/contract summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account observations',
				items: [
					{
						label: 'timestamped account activity/count observations',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'network actor coin balances',
					},
				],
			},
			{
				label: 'Activity',
				items: [
					{
						label: 'transactions',
					},
					{
						label: 'token transfers',
					},
					{
						label: 'internal transfers',
					},
				],
			},
			{
				label: 'Allowances',
				items: [
					{
						label: 'known ERC-20 allowance identities',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'linked contract row when code/source evidence resolves',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkAccount>
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
	entityType={EntityType.EvmNetworkAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
