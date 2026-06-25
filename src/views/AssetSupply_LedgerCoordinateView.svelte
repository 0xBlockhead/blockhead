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
		{
			label: 'supply scope',
		},
		{
			label: 'coordinate kind/value',
		},
	],
	content: {
		dl: [
			[
				'$assetInstance',
				'supplyScopeKey',
				{
					label: 'optional class',
				},
				{
					label: 'coordinate kind/value',
				},
				'source',
			],
			[
				'totalSupply',
				'maxSupply',
				'mintedSupply',
				'burnedSupply',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset',
				items: [
					'$assetInstance',
				],
			},
			{
				label: 'Class',
				items: [
					{
						label: 'parent class when supplyScopeKey targets a class',
					},
				],
			},
			{
				label: 'Source payload',
				items: [
					{
						label: 'chain/indexer-specific raw fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetSupply_LedgerCoordinate>
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
	entityType={EntityType.AssetSupply_LedgerCoordinate}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
