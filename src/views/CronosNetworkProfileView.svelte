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
			label: 'linked base Network',
		},
		'$evmNetwork',
		'$cosmosNetwork',
	],
	content: {
		dl: [
			[
				{
					label: 'linked base Network',
				},
				'$evmNetwork',
				'$cosmosNetwork',
				'chainKind',
				'consensusKind',
			],
			[
				'evmChainId',
				'cosmosChainId',
				'bech32Prefix',
				{
					label: 'Cosmos SDK head',
				},
				'$$ibcChannels',
			],
			[
				{
					label: 'validators through Cosmos network',
				},
				{
					label: 'timestamp history',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network facets',
				items: [
					{
						label: 'base Network row',
					},
					{
						label: 'EVM network row',
					},
					{
						label: 'Cosmos network row',
					},
				],
			},
			{
				label: 'Identifiers',
				items: [
					'evmChainId',
					'cosmosChainId',
					'bech32Prefix',
				],
			},
			{
				label: 'IBC',
				items: [
					{
						label: 'IBC channel rows',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped network/head observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'chain registry',
					},
					{
						label: 'CometBFT/Cosmos SDK',
					},
					{
						label: 'Cronos explorer payload',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'ibc-channels',
			label: 'ibc channels',
			field: '$$ibcChannels',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
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
			selection: EntityProxyResource<typeof schema, EntityType.CronosNetworkProfile>
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
	entityType={EntityType.CronosNetworkProfile}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
