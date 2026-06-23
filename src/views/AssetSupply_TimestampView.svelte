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
				label: 'asset instance',
			},
			{
				label: 'supply scope',
			},
			{
				label: 'observation time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'asset instance',
					},
					{
						label: 'supply scope key',
					},
					{
						label: 'optional class key',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'total supply',
					},
					{
						label: 'circulating supply',
					},
					{
						label: 'burned supply',
					},
					'methodology',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Asset',
					items: [
						{
							label: 'parent asset instance',
						},
					],
				},
				{
					label: 'Class',
					items: [
						{
							label: 'parent class when supplyScopeKey maps to a class',
						},
					],
				},
				{
					label: 'Methodology',
					items: [
						{
							label: 'source clock',
						},
						{
							label: 'query',
						},
						{
							label: 'inclusion/exclusion notes',
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
			selection: EntityProxyResource<typeof schema, EntityType.AssetSupply_Timestamp>
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
	entityType={EntityType.AssetSupply_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
