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
		'$$blocks',
		{
			label: 'latest app/submission counts',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'latest block number/hash',
				},
				{
					label: 'latest health/finality',
				},
				'$$appIds',
				'$$dataSubmissions',
				{
					label: 'source coverage',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest status',
				items: [
					{
						label: 'latest head/finality/indexer observation',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'Avail block rows',
					},
				],
			},
			{
				label: 'App ids',
				items: [
					{
						label: 'DA app id rows',
					},
				],
			},
			{
				label: 'Data submissions',
				items: [
					{
						label: 'DA data submission rows',
					},
				],
			},
			{
				label: 'Scaling usage',
				items: [
					{
						label: 'scaling deployment claims whose DA network/selector points at Avail',
					},
				],
			},
			{
				label: 'Substrate base',
				items: [
					{
						label: 'Substrate/Polkadot rows when runtime/account rows are sourced',
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
			id: 'app-ids',
			label: 'app ids',
			field: '$$appIds',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'data-submissions',
			label: 'data submissions',
			field: '$$dataSubmissions',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvailNetwork>
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
	entityType={EntityType.AvailNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
