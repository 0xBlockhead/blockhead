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
			label: 'L2Beat name',
		},
		'type',
		'category',
	],
	content: {
		dl: [
			[
				{
					label: 'L2Beat name',
				},
				'type',
				'category',
				'hostChain',
				'$settlementNetwork',
				{
					label: 'latest source status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Settlement',
				items: [
					{
						label: 'settlement EVM network derived from L2Beat hostChain mapping',
					},
				],
			},
			{
				label: 'Status history',
				items: [
					{
						label: 'timestamped L2Beat project status observations',
					},
				],
			},
			{
				label: 'Source identity',
				items: [
					{
						label: 'L2Beat project id',
					},
					'slug',
				],
			},
			{
				label: 'Architecture claims',
				items: [
					{
						label: 'ScalingDeploymentClaim rows may link back to this rollup when a richer source resolves them',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmRollup>
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
	entityType={EntityType.EvmRollup}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
