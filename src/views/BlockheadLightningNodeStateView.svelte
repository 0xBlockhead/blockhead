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
		'connectionId',
		'$network',
		{
			label: 'node pubkey',
		},
	],
	content: {
		dl: [
			[
				'connectionId',
				'$network',
				{
					label: 'node pubkey',
				},
				'alias',
				{
					label: 'latest chain sync',
				},
			],
			[
				{
					label: 'latest graph sync',
				},
				{
					label: 'latest block height',
				},
				{
					label: 'latest balance summary',
				},
				{
					label: 'latest peer/channel counts',
				},
				{
					label: 'macaroon permission summary',
				},
			],
			[
				{
					label: 'latest sync time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest connected-node observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped connected-node observations',
					},
				],
			},
			{
				label: 'Public node',
				items: [
					{
						label: 'public Lightning node when advertised',
					},
				],
			},
			{
				label: 'Local channel states',
				items: [
					{
						label: 'local channel-state rows',
					},
				],
			},
			{
				label: 'Public channel refs',
				items: [
					{
						label: 'public channel rows for channels with graph identities',
					},
				],
			},
			{
				label: 'Invoices',
				items: [
					{
						label: 'local invoice rows',
					},
				],
			},
			{
				label: 'Payments',
				items: [
					{
						label: 'local payment rows',
					},
				],
			},
			{
				label: 'Permissions',
				items: [
					'macaroonPermissions',
					{
						label: 'connection metadata',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Lightning network',
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
		{
			id: 'channel-states',
			label: 'channel states',
			field: '$$channelStates',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'channels',
			label: 'channels',
			field: '$$channels',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'invoices',
			label: 'invoices',
			field: '$$invoices',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'payments',
			label: 'payments',
			field: '$$payments',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningNodeState>
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
	entityType={EntityType.BlockheadLightningNodeState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
