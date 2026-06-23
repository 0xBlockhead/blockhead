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
				label: 'asset id',
			},
			{
				label: 'latest name',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'asset id',
					},
					{
						label: 'latest name',
					},
					{
						label: 'latest size decimals',
					},
					{
						label: 'latest wei decimals',
					},
					{
						label: 'latest token id',
					},
					{
						label: 'base pair count',
					},
					{
						label: 'quote pair count',
					},
					{
						label: 'timestamp count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest state',
					items: [
						{
							label: 'latest spot-asset universe observation',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'timestamped spot-asset universe observations',
						},
					],
				},
				{
					label: 'Spot pairs',
					items: [
						{
							label: 'base-side and quote-side spot pair rows',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Hyperliquid network',
						},
					],
				},
				{
					label: 'Related markets',
					items: [
						{
							label: 'generic market rows only when separate venue/base/quote selectors map spot pairs to market identity',
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidSpotAsset>
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
	entityType={EntityType.HyperliquidSpotAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
