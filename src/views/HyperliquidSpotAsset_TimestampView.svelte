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
				label: 'spot asset',
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
						label: 'spot asset',
					},
					{
						label: 'observation time',
					},
					'source',
					'name',
					{
						label: 'size decimals',
					},
					{
						label: 'wei decimals',
					},
					{
						label: 'token id',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Spot asset',
					items: [
						{
							label: 'parent spot asset',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Hyperliquid network through spot asset',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw spotMeta.tokens row',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidSpotAsset_Timestamp>
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
	entityType={EntityType.HyperliquidSpotAsset_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
