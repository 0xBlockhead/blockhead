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
		'$network',
		'clientId',
		'clientType',
	],
	content: {
		dl: [
			[
				'$network',
				'clientId',
				'clientType',
				'latestHeight',
				'frozenHeight',
			],
			[
				'counterpartyChainId',
				'trustLevel',
				{
					label: 'trusting period',
				},
				{
					label: 'unbonding period',
				},
				{
					label: 'max clock drift',
				},
			],
			[
				'$$connections',
				'$$channels',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Connections',
				items: [
					{
						label: 'IBC connections using this client',
					},
				],
			},
			{
				label: 'Channels',
				items: [
					{
						label: 'IBC channels using this client',
					},
				],
			},
			{
				label: 'Counterparty',
				items: [
					{
						label: 'resolved network plus registry/indexer chain claims',
					},
				],
			},
			{
				label: 'Consensus states',
				items: [
					{
						label: 'decoded consensus-state list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'client state',
					},
					{
						label: 'consensus-state query payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'connections',
			label: 'connections',
			field: '$$connections',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.IbcClient>
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
	entityType={EntityType.IbcClient}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
