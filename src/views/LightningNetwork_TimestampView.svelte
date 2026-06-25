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
		'$lightningNetwork',
		{
			label: 'timestamp/source',
		},
		'nodeCount',
	],
	content: {
		dl: [
			[
				'$lightningNetwork',
				{
					label: 'timestamp/source',
				},
				'nodeCount',
				'channelCount',
				'totalCapacitySats',
			],
			[
				{
					label: 'Tor/clearnet/unannounced counts',
				},
				{
					label: 'average/median capacity',
				},
				{
					label: 'average/median fee rate',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					'$lightningNetwork',
				],
			},
			{
				label: 'Graph size',
				items: [
					{
						label: 'node/channel counts',
					},
				],
			},
			{
				label: 'Capacity',
				items: [
					{
						label: 'total/average/median capacity',
					},
				],
			},
			{
				label: 'Connectivity',
				items: [
					{
						label: 'Tor/clearnet/unannounced counts',
					},
				],
			},
			{
				label: 'Fees',
				items: [
					{
						label: 'average/median fee rate',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'mempool.space/Amboss/LND graph snapshot payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNetwork_Timestamp>
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
	entityType={EntityType.LightningNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
