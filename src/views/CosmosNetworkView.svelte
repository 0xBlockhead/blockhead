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
		{
			label: 'latest head snapshot',
		},
		'restEndpoints',
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'latest head snapshot',
				},
				'restEndpoints',
			],
			[
				{
					label: 'bounded validator count',
				},
				{
					label: 'bounded governance proposal count',
				},
				{
					label: 'denom/account/module entry points',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution',
				items: [
					'$$blocks',
					{
						label: 'Transactions',
					},
					{
						label: 'Network snapshots',
					},
					{
						label: 'Endpoints',
					},
				],
			},
			{
				label: 'Consensus & Governance',
				items: [
					'$$validators',
					{
						label: 'Validator snapshots',
					},
					'$$governanceProposals',
				],
			},
			{
				label: 'Accounts & Modules',
				items: [
					'$$accounts',
					'$$modules',
					{
						label: 'CosmWasm contracts',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'native denom metadata',
					},
					{
						label: 'account balance snapshots',
					},
				],
			},
			{
				label: 'Source coverage',
				items: [
					{
						label: 'Cosmos SDK REST endpoint',
					},
					{
						label: 'Cosmos Chain Registry catalog seeds',
					},
					{
						label: 'CometBFT REST when wired',
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
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'validators',
			label: 'validators',
			field: '$$validators',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'governance-proposals',
			label: 'governance proposals',
			field: '$$governanceProposals',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'denoms',
			label: 'denoms',
			field: '$$denoms',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'accounts',
			label: 'accounts',
			field: '$$accounts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'contracts',
			label: 'contracts',
			field: '$$contracts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'modules',
			label: 'modules',
			field: '$$modules',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosNetwork>
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
	entityType={EntityType.CosmosNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
