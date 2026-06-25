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
		'$miner',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$miner',
				'timestampMs',
				'source',
				'height',
				'$owner',
				'$worker',
				'peerId',
			],
			[
				{
					label: 'raw power',
				},
				'qualityAdjustedPower',
				{
					label: 'network power',
				},
				'liveSectorCount',
				'faultySectorCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Miner',
				items: [
					{
						label: 'parent Filecoin miner',
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
				label: 'Power',
				items: [
					'$miner',
					{
						label: 'network power comparison',
					},
				],
			},
			{
				label: 'Sectors',
				items: [
					{
						label: 'sector count/fault summaries',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'StateMinerInfo',
					},
					{
						label: 'StateMinerPower',
					},
					{
						label: 'indexer payload evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinMiner_Timestamp>
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
	entityType={EntityType.FilecoinMiner_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
