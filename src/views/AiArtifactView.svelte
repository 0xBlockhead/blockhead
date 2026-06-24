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
			'digestAlgorithm',
			'digest',
		],
		content: {
			dl: [
				[
					'digestAlgorithm',
					'digest',
					'ociDigest',
					'ipfsCid',
					'arweaveId',
					'gitObject',
					'uri',
					'mediaType',
					'artifactType',
					'configDescriptor',
					'layerDescriptors',
					'subjectDescriptor',
					'annotations',
					'size',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'documents',
					when: 'open',
					items: [
						'$$documents',
					],
				},
				{
					label: 'attestations',
					when: 'open',
					items: [
						'$$attestations',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiArtifact>
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
	entityType={EntityType.AiArtifact}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
