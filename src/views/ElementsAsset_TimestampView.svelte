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
				label: 'asset',
			},
			{
				label: 'observation time',
			},
			{
				label: 'issued amount',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'asset',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'issued amount',
					},
					{
						label: 'burned amount',
					},
					{
						label: 'reissuance token count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Asset',
					items: [
						{
							label: 'parent Elements asset',
						},
					],
				},
				{
					label: 'Issuances',
					items: [
						{
							label: 'issuance rows near this source/window',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Liquid Esplora asset registry/indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsAsset_Timestamp>
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
	entityType={EntityType.ElementsAsset_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
