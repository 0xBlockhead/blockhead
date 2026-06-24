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
			label: 'relay',
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
					label: 'relay',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'reachable/status code',
				},
				{
					label: 'delivered-payload sample count',
				},
				{
					label: 'builder sample count',
				},
			],
			[
				{
					label: 'slot window',
				},
				{
					label: 'sample limit',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Relay',
				items: [
					{
						label: 'parent MEV relay',
					},
				],
			},
			{
				label: 'Delivered payload sample',
				items: [
					{
						label: 'delivered-payload rows for same relay/window',
					},
				],
			},
			{
				label: 'Builders',
				items: [
					{
						label: 'builders observed in sample',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'relay data API URL',
					},
					{
						label: 'limit/pagination parameters',
					},
					{
						label: 'aggregator freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.MevRelay_Timestamp>
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
	entityType={EntityType.MevRelay_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
