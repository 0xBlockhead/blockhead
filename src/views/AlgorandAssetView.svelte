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
				label: 'asset id',
			},
			'creator',
			{
				label: 'latest unit/name',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'asset id',
					},
					'creator',
					{
						label: 'network',
					},
				],
				[
					{
						label: 'latest unit/name/decimals',
					},
					{
						label: 'latest manager/reserve/freeze/clawback addresses',
					},
					{
						label: 'latest supply snapshot',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest params',
					items: [
						{
							label: 'latest round/source asset observation',
						},
					],
				},
				{
					label: 'Param history',
					items: [
						{
							label: 'round/source asset parameter observations',
						},
					],
				},
				{
					label: 'Holdings',
					items: [
						{
							label: 'account holding rows for this asset',
						},
					],
				},
				{
					label: 'Metadata',
					items: [
						{
							label: 'ARC/source metadata from latest params URL/hash',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandAsset>
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
	entityType={EntityType.AlgorandAsset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
