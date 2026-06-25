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
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$network',
				'timestampMs',
				'source',
				'releasedSupplyTinybar',
				'totalSupplyTinybar',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'parent Hedera network',
					},
				],
			},
			{
				label: 'Supply',
				items: [
					{
						label: 'released and total tinybar supply',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'network supply payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetworkSupply_Timestamp>
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
	entityType={EntityType.HederaNetworkSupply_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
