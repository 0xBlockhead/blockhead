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
			'subjectKind',
			'subjectSelector',
			'relationshipKind',
			'objectKind',
			'objectSelector',
			'source',
			'timestampMs',
		],
		content: {
			dl: [
				[
					'subjectKind',
					'subjectSelector',
					'relationshipKind',
					'objectKind',
					'objectSelector',
					'source',
					'timestampMs',
					'confidence',
					'evidenceUri',
					'evidenceHashAlgorithm',
					'evidenceHash',
					'signature',
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
			selection: EntityProxyResource<typeof schema, EntityType.AiRelationshipClaim>
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
	entityType={EntityType.AiRelationshipClaim}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
