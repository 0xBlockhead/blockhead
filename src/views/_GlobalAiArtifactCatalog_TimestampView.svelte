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
				label: 'catalog',
			},
			{
				label: 'observation time',
			},
			'source',
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'catalog',
					},
					{
						label: 'timestamp',
					},
					'source',
					'status',
					'error',
				],
				[
					{
						label: 'source-reported/local artifact counts',
					},
					{
						label: 'source-reported/local document counts',
					},
					{
						label: 'format counts',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Catalog',
					items: [
						{
							label: '_GlobalAiArtifactCatalog',
						},
					],
				},
				{
					label: 'Format coverage',
					items: [
						{
							label: 'OCI/SPDX/CycloneDX/Croissant/MLflow/ONNX counts',
						},
					],
				},
				{
					label: 'Source window',
					items: [
						{
							label: 'query hash algorithm/hash',
						},
						{
							label: 'cursor',
						},
						{
							label: 'endpoint coverage',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiArtifactCatalog_Timestamp>
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
	entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
