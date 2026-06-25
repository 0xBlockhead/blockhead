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
			label: 'dataset selector',
		},
		'label',
		'modality',
	],
	content: {
		dl: [
			[
				'datasetUri',
				{
					label: 'HF dataset id/revision',
				},
				{
					label: 'source dataset name/digest',
				},
				'$artifact',
			],
			[
				'label',
				'license',
				'version',
				{
					label: 'live dataset',
				},
				'modality',
				{
					label: 'document refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Documents',
				items: [
					{
						label: 'AiDocument list',
					},
				],
			},
			{
				label: 'Benchmarks',
				items: [
					{
						label: 'AiBenchmark list',
					},
				],
			},
			{
				label: 'Artifacts',
				items: [
					{
						label: 'AiArtifact when present',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'documents',
			label: 'documents',
			field: '$$documents',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AiDataset>
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
	entityType={EntityType.AiDataset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
