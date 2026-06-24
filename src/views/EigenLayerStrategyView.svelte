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
			label: 'strategy address',
		},
		{
			label: 'underlying token',
		},
		{
			label: 'latest total shares',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'strategy address',
				},
				{
					label: 'underlying token',
				},
				{
					label: 'underlying coin',
				},
				{
					label: 'strategy kind',
				},
				{
					label: 'latest total shares/underlying',
				},
			],
			[
				{
					label: 'network',
				},
				{
					label: 'strategy contract',
				},
				{
					label: 'delegation count',
				},
				{
					label: 'allocation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped strategy accounting observations',
					},
				],
			},
			{
				label: 'Delegations',
				items: [
					{
						label: 'delegation observations filtered by strategy',
					},
				],
			},
			{
				label: 'Allocations',
				items: [
					{
						label: 'allocation observations filtered by strategy',
					},
				],
			},
			{
				label: 'Token',
				items: [
					{
						label: 'underlying EVM coin instance',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'strategy EVM contract',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'StrategyManager strategy reads',
					},
					{
						label: 'strategy token/share math',
					},
					{
						label: 'indexer freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerStrategy>
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
	entityType={EntityType.EigenLayerStrategy}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
