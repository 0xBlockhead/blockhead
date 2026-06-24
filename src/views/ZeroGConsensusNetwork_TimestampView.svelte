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
			label: 'consensus network',
		},
		{
			label: 'observation time',
		},
		{
			label: 'staking status source',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'consensus network',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'shared staking status source',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Consensus network',
				items: [
					{
						label: 'parent consensus-network identity',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: '0G ChainScan consensus/storage status payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGConsensusNetwork_Timestamp>
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
	entityType={EntityType.ZeroGConsensusNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
