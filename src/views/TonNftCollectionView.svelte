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
		'collectionAddress',
		'$account',
	],
	content: {
		dl: [
			[
				'$network',
				'collectionAddress',
				'$account',
				{
					label: 'latest owner/metadata/item-count observation',
				},
				{
					label: 'item/transfer/timestamp windows',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'collection contract account',
					},
				],
			},
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest collection-state observation',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'collection-state observation history',
					},
				],
			},
			{
				label: 'Items',
				items: [
					{
						label: 'collection item contracts',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'decoded item transfer effects',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'contract classification when interface detection resolves',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'items',
			label: 'items',
			field: '$$items',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'transfers',
			label: 'transfers',
			field: '$$transfers',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonNftCollection>
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
	entityType={EntityType.TonNftCollection}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
