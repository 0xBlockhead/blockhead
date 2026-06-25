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
			label: 'contract address',
		},
		{
			label: 'account-state summary',
		},
		{
			label: 'activity counts',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'contract address',
				},
				{
					label: 'latest account-state observation',
				},
				{
					label: 'storage entry count',
				},
				{
					label: 'bounded event count',
				},
				{
					label: 'bounded transaction count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account/state history',
				items: [
					{
						label: 'block/source account state observations',
					},
				],
			},
			{
				label: 'Storage',
				items: [
					{
						label: 'contract storage entries',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'bounded contract event windows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'bounded contract transaction windows',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Starknet network',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'account-states',
			label: 'account states',
			field: '$$accountStates',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'storage',
			label: 'storage',
			field: '$$storage',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'events',
			label: 'events',
			field: '$$events',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetContract>
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
	entityType={EntityType.StarknetContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
