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
			label: 'asset',
		},
		'slot',
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'asset',
				},
				'slot',
				'source',
				{
					label: 'observation time',
				},
				{
					label: 'block hash',
				},
				'supply',
				{
					label: 'transaction count',
				},
				{
					label: 'holder count',
				},
				{
					label: 'metadata snapshot hash/summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Asset',
				items: [
					{
						label: 'parent Cardano native asset',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'CIP-25/CIP-68/source payload',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Blockfrost/Koios/db-sync query context',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoNativeAsset_Timestamp>
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
	entityType={EntityType.CardanoNativeAsset_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
