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
		'unitName',
		{
			label: 'total supply',
		},
		'round',
	],
	content: {
		dl: [
			[
				'$asset',
				'round',
				'source',
				{
					label: 'total supply',
				},
				'decimals',
				'defaultFrozen',
			],
			[
				{
					label: 'unit/name/url/metadata hash',
				},
				{
					label: 'manager/reserve/freeze/clawback',
				},
				'holderCount',
				'deleted',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset',
				items: [
					{
						label: 'parent asset identity',
					},
				],
			},
			{
				label: 'Holdings at round',
				items: [
					{
						label: 'asset holding rows when indexed',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'ARC/source metadata URL/hash',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'algod/indexer asset params payload',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandAsset_Timestamp>
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
	entityType={EntityType.AlgorandAsset_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
