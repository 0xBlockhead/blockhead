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
				label: 'market',
			},
			{
				label: 'observed time',
			},
			{
				label: 'feed key',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'market',
					},
					{
						label: 'observed time',
					},
					{
						label: 'feed key',
					},
					{
						label: 'parent market',
					},
					{
						label: 'funding rate',
					},
					{
						label: 'open interest USD',
					},
					{
						label: 'index basis',
					},
					{
						label: 'mark price',
					},
					{
						label: 'index price',
					},
					{
						label: 'expiry',
					},
					{
						label: 'last traded time',
					},
					{
						label: 'provider asset id',
					},
					'transport',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Market',
					items: [
						{
							label: 'Market',
						},
					],
				},
				{
					label: 'Derivative metrics',
					items: [
						{
							label: 'funding rate',
						},
						{
							label: 'open interest USD',
						},
						{
							label: 'index basis',
						},
					],
				},
				{
					label: 'Prices',
					items: [
						{
							label: 'mark price',
						},
						{
							label: 'index price',
						},
					],
				},
				{
					label: 'Lifecycle',
					items: [
						{
							label: 'expiry',
						},
						{
							label: 'last traded time',
						},
					],
				},
				{
					label: 'Provider mapping',
					items: [
						{
							label: 'feed key',
						},
						{
							label: 'provider asset id',
						},
						'transport',
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
			selection: EntityProxyResource<typeof schema, EntityType.Market_Derivative_Timestamp>
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
	entityType={EntityType.Market_Derivative_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
