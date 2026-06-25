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
		'$deal',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$deal',
				'timestampMs',
				'source',
				'height',
				'tipsetKey',
			],
			[
				'sectorStartEpoch',
				'lastUpdatedEpoch',
				'slashEpoch',
				'verifiedDeal',
				'providerCollateralAttoFil',
			],
			[
				'clientCollateralAttoFil',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Deal',
				items: [
					{
						label: 'parent Filecoin deal',
					},
				],
			},
			{
				label: 'Tipset',
				items: [
					{
						label: 'Filecoin tipset when resolved',
					},
				],
			},
			{
				label: 'State',
				items: [
					{
						label: 'activation/update/slash lifecycle fields',
					},
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'StateMarketStorageDeal or indexer payload evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinDeal_Timestamp>
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
	entityType={EntityType.FilecoinDeal_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
