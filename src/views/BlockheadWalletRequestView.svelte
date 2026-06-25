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
			label: 'request id',
		},
		'requestKind',
		{
			label: 'latest status',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'request id',
				},
				'walletProtocol',
				'requestKind',
				{
					label: 'method',
				},
				{
					label: 'latest status',
				},
			],
			[
				'$walletConnection',
				{
					label: 'account',
				},
				'chainId',
				{
					label: 'from/to',
				},
				'value',
			],
			[
				'callCount',
				'atomicRequired',
				{
					label: 'requested time',
				},
				{
					label: 'submitted time',
				},
			],
			[
				{
					label: 'latest signature hash',
				},
				{
					label: 'latest transaction hash',
				},
				{
					label: 'latest transaction id',
				},
				'walletCallBundleId',
				'requestPayloadHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Status history',
				items: [
					{
						label: 'BlockheadWalletRequest_Timestamp list',
					},
				],
			},
			{
				label: 'Session action',
				items: [
					{
						label: 'BlockheadSessionActionView when linked',
					},
				],
			},
			{
				label: 'Intent order',
				items: [
					{
						label: 'BlockheadIntentOrderView when linked',
					},
				],
			},
			{
				label: 'Wallet',
				items: [
					{
						label: 'BlockheadWalletConnectionView when linked',
					},
				],
			},
			{
				label: 'Chain evidence',
				items: [
					{
						label: 'EvmTransaction or protocol transaction rows when the hash/id resolves publicly',
					},
				],
			},
			{
				label: 'Request evidence',
				items: [
					{
						label: 'request payload retained locally only when needed',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletRequest>
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
	entityType={EntityType.BlockheadWalletRequest}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
