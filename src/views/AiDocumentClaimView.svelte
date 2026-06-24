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
			'extractorId',
			'claimPath',
		],
		content: {
			dl: [
				[
					'extractorId',
					'claimPath',
					'claimKind',
					'value',
					'subjectKind',
					'subjectSelector',
					'metadataKey',
					'formatObjectId',
					'formatObjectKind',
					'checksumAlgorithm',
					'checksumValue',
					'relationshipKind',
					'normalizedSelector',
					'confidence',
				],
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AiDocumentClaim>
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
	entityType={EntityType.AiDocumentClaim}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
