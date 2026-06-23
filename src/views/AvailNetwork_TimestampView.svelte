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
			{
				label: 'latest block',
			},
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
						label: 'latest block number/hash',
					},
					{
						label: 'finalized block number/hash',
					},
					{
						label: 'health/syncing',
					},
				],
				[
					{
						label: 'app id count',
					},
					{
						label: 'data submission count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'parent Avail network',
						},
					],
				},
				{
					label: 'Latest block',
					items: [
						{
							label: 'latest block when resolved',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'system health/status',
						},
						{
							label: 'chain header/finality RPC',
						},
						{
							label: 'indexer summary freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvailNetwork_Timestamp>
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
	entityType={EntityType.AvailNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
