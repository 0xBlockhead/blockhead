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
				label: 'network',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'block height',
					},
					{
						label: 'indexer height',
					},
					{
						label: 'market count',
					},
					{
						label: 'subaccount count',
					},
					{
						label: 'open order count',
					},
					{
						label: 'open position count',
					},
					'health',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent dYdX Chain network',
						},
					],
				},
				{
					label: 'Markets',
					items: [
						{
							label: 'market rows at same source/head when available',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'indexer status/height payload',
						},
						{
							label: 'validator node status',
						},
						{
							label: 'app-state query freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainNetwork_Timestamp>
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
	entityType={EntityType.DydxChainNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
