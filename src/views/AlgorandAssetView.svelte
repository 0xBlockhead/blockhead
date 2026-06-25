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
		'assetId',
		'creator',
		{
			label: 'latest unit/name',
		},
	],
	content: {
		dl: [
			[
				'assetId',
				'creator',
				'$network',
			],
			[
				{
					label: 'latest unit/name/decimals',
				},
				{
					label: 'latest manager/reserve/freeze/clawback addresses',
				},
				{
					label: 'latest supply snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest params',
				items: [
					{
						label: 'latest round/source asset observation',
					},
				],
			},
			{
				label: 'Param history',
				items: [
					{
						label: 'round/source asset parameter observations',
					},
				],
			},
			{
				label: 'Holdings',
				items: [
					{
						label: 'account holding rows for this asset',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'ARC/source metadata from latest params URL/hash',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'holding-rounds',
			label: 'holding rounds',
			field: '$$holdingRounds',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandAsset>
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
	entityType={EntityType.AlgorandAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
