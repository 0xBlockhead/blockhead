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
			label: 'subject',
		},
		{
			label: 'relationship',
		},
		{
			label: 'object',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'subject kind/selector',
				},
				{
					label: 'relationship kind',
				},
				{
					label: 'object kind/selector',
				},
			],
			[
				'source',
				{
					label: 'timestamp',
				},
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
					{
						label: 'document',
					},
					{
						label: 'document claim',
					},
					{
						label: 'evidence URI/hash algorithm/hash',
					},
					'signature',
				],
			},
			{
				label: 'Subject',
				items: [
					{
						label: 'subject selector',
					},
				],
			},
			{
				label: 'Object',
				items: [
					{
						label: 'object selector',
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
