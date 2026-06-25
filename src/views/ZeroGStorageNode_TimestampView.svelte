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
		'$storageNode',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$storageNode',
				'timestampMs',
				'source',
				'balance',
				'totalReward',
				'winCount',
				'miningAttempts',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Storage node',
				items: [
					{
						label: 'parent public storage node',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent 0G network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'miner detail/list payload',
					},
					{
						label: 'scan timestamp',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGStorageNode_Timestamp>
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
	entityType={EntityType.ZeroGStorageNode_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
