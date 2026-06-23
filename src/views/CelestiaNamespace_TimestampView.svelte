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
				label: 'namespace',
			},
			{
				label: 'observation time',
			},
			{
				label: 'blob count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'namespace',
					},
					{
						label: 'observation time',
					},
					'source',
					'height',
					{
						label: 'blob count',
					},
					{
						label: 'source-window height range',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Namespace',
					items: [
						{
							label: 'parent Celestia namespace',
						},
					],
				},
				{
					label: 'Blobs',
					items: [
						{
							label: 'Celestia blobs for the same namespace/window',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'blob.GetAll namespace query',
						},
						{
							label: 'Celenium namespace/indexer window',
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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaNamespace_Timestamp>
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
	entityType={EntityType.CelestiaNamespace_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
