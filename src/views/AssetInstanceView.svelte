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
		'kind',
		'assetKey',
	],
	content: {
		dl: [
			[
				'$network',
				'kind',
				'assetKey',
				'coinId',
				'name',
			],
			[
				'symbol',
				'decimals',
				'$icon',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Formats',
				items: [
					{
						label: 'format-support observations grouped by standard/profile',
					},
				],
			},
			{
				label: 'Supply',
				items: [
					{
						label: 'ledger-coordinate and provider-clocked supply rows',
					},
				],
			},
			{
				label: 'Objects/classes',
				items: [
					{
						label: 'class/object rows when source-backed',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'registry/catalog display metadata and media refs',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'formats',
			label: 'formats',
			field: '$$formats',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetInstance>
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
	entityType={EntityType.AssetInstance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
