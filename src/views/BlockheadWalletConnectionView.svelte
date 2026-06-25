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
			label: 'wallet id',
		},
		'connectionKey',
		'status',
		'protocol',
	],
	content: {
		dl: [
			[
				{
					label: 'wallet id',
				},
				'connectionKey',
				'status',
				'protocol',
				'transportKind',
				'apiSurfaceKind',
				'sessionKind',
			],
			[
				'$activeAccount',
				'selected',
				{
					label: 'connected/updated/disconnected/expires timestamps',
				},
				{
					label: 'session id/topic/pairing id',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Accounts',
				items: [
					{
						label: 'BlockheadWalletAccount list, empty while connecting/error/disconnected',
					},
				],
			},
			{
				label: 'Scopes',
				items: [
					{
						label: 'namespace/reference/chains/accounts/methods/events/capabilities authorization rows',
					},
				],
			},
			{
				label: 'Requests',
				items: [
					{
						label: 'BlockheadWalletRequest rows',
					},
				],
			},
			{
				label: 'Transport session',
				items: [
					{
						label: 'BlockheadWalletTransportSession when durable transport identity exists',
					},
				],
			},
			{
				label: 'Connection method',
				items: [
					{
						label: 'WalletConnectionMethod',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'connected-accounts',
			label: 'connected accounts',
			field: '$$connectedAccounts',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletConnection>
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
	entityType={EntityType.BlockheadWalletConnection}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
