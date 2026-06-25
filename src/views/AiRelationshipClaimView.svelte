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
		'relationshipKind',
		'objectKind',
	],
	content: {
		dl: [
			[
				{
					label: 'subject kind/selector',
				},
				'relationshipKind',
				{
					label: 'object kind/selector',
				},
			],
			[
				'source',
				'timestampMs',
				'confidence',
				{
					label: 'document/claim/evidence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Evidence',
				items: [
					'$document',
					'$documentClaim',
					{
						label: 'evidence URI/hash algorithm/hash',
					},
					'signature',
				],
			},
			{
				label: 'Subject',
				items: [
					'subjectSelector',
				],
			},
			{
				label: 'Object',
				items: [
					'objectSelector',
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
