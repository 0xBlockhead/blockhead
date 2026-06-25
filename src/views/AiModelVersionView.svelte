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
			label: 'model/version or artifact',
		},
		'revision',
	],
	content: {
		dl: [
			[
				'$model',
				'versionId',
				'$artifact',
				{
					label: 'HF repo/revision',
				},
			],
			[
				{
					label: 'MLflow registered model/version',
				},
				{
					label: 'ONNX IR/opsets',
				},
				'createdAt',
				'trainingCutoff',
				'quantization',
				'fineTuneKind',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Model',
				items: [
					{
						label: 'AiModel when present',
					},
				],
			},
			{
				label: 'Artifact',
				items: [
					{
						label: 'AiArtifact when present',
					},
				],
			},
			{
				label: 'Documents',
				items: [
					{
						label: 'AiDocument list',
					},
				],
			},
			{
				label: 'Relationships',
				items: [
					{
						label: 'AiRelationshipClaim list',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiModelVersion>
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
	entityType={EntityType.AiModelVersion}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
