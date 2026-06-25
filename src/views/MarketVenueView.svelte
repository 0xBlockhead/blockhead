<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	lists: [
		{
			id: 'markets',
			label: 'Markets',
			field: '$$markets',
			slot: 'MarketsList',
		},
	],
	slots: [
		{
			slot: 'MarketsList',
			label: 'venue markets list',
			for: 'Details',
		},
	],
	closed: [
		{
			label: 'venue id',
		},
		'label',
	],
	content: {
		dl: [
			[
				{
					label: 'venue id',
				},
				'label',
				'$$markets',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Markets',
				items: [
					{
						label: 'Market rows for this venue',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'checked-in venue catalog',
					},
					{
						label: 'provider exchange mappings',
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
			selection: EntityProxyResource<typeof schema, EntityType.MarketVenue>
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
	entityType={EntityType.MarketVenue}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
