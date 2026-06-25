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
		'address',
		{
			label: 'latest microAlgos',
		},
		{
			label: 'rewards',
		},
	],
	content: {
		dl: [
			[
				'address',
				{
					label: 'latest microAlgos',
				},
				{
					label: 'rewards',
				},
				{
					label: 'status snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset holdings',
				items: [
					{
						label: 'round-scoped asset holding rows',
					},
				],
			},
			{
				label: 'Application local state',
				items: [
					{
						label: 'round-scoped account/application state rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions involving this address when indexed',
					},
				],
			},
			{
				label: 'Account snapshots',
				items: [
					{
						label: 'round/source account observations',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'asset-holding-rounds',
			label: 'asset holding rounds',
			field: '$$assetHoldingRounds',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'application-local-state-rounds',
			label: 'application local state rounds',
			field: '$$applicationLocalStateRounds',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandAccount>
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
	entityType={EntityType.AlgorandAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
