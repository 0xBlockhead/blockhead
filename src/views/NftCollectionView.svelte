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
		'$assetInstance',
		'$$tokens',
		{
			label: 'royalty observation count',
		},
	],
	content: {
		dl: [
			[
				'$assetInstance',
				'$$tokens',
				{
					label: 'royalty observation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Tokens',
				items: [
					{
						label: 'collection-scoped token rows',
					},
				],
			},
			{
				label: 'Asset instance',
				items: [
					'$assetInstance',
				],
			},
			{
				label: 'Royalty observations',
				items: [
					{
						label: 'timestamped royalty-right observations',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'collection-level token metadata documents',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'tokens',
			label: 'tokens',
			field: '$$tokens',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'royalty-timestamps',
			label: 'royalty timestamps',
			field: '$$royaltyTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.NftCollection>
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
	entityType={EntityType.NftCollection}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
