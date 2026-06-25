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
			label: 'CAIP-10 namespace/reference/address',
		},
		{
			label: 'canonical address when derivable',
		},
		'$network',
	],
	content: {
		dl: [
			[
				{
					label: 'CAIP-10 namespace/reference/address',
				},
				{
					label: 'canonical address when derivable',
				},
				'$network',
				{
					label: 'EVM account/network-account refs when namespace is eip155',
				},
				'nativeAccountSelector',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Native account',
				items: [
					{
						label: 'protocol-specific account identity',
					},
				],
			},
			{
				label: 'EVM account',
				items: [
					{
						label: 'EVM account and network-account identity when namespace is eip155',
					},
				],
			},
			{
				label: 'Wallet exposure',
				items: [
					{
						label: 'local wallet accounts that exposed this account',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'wallet-accounts',
			label: 'wallet accounts',
			field: '$$walletAccounts',
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
			selection: EntityProxyResource<typeof schema, EntityType.Account>
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
	entityType={EntityType.Account}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
