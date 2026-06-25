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
		'address',
		{
			label: 'latest balance/activity summary when present',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'address',
				{
					label: 'latest balance/activity summary when present',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Stats',
				items: [
					{
						label: 'address statistic observations',
					},
				],
			},
			{
				label: 'Outputs',
				items: [
					{
						label: 'spendable outputs when source exposes them',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'address history when source exposes it',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent network and UTXO-family projection',
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
			id: 'outputs',
			label: 'outputs',
			field: '$$outputs',
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoAddress>
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
	entityType={EntityType.UtxoAddress}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
