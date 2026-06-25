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
		'$session',
		'modality',
		{
			label: 'source/target entity types',
		},
	],
	content: {
		dl: [
			[
				'$session',
				'modality',
				'sourceEntityType',
				'targetEntityType',
				{
					label: 'placements',
				},
			],
			[
				'invocationPayloadHash',
				'resolvedIntentType',
				{
					label: 'intent definition key/hash',
				},
				{
					label: 'selected option index/hash',
				},
				'createdAt',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Source selector',
				items: [
					{
						label: 'serialized selector payload when present',
					},
				],
			},
			{
				label: 'Target selector',
				items: [
					{
						label: 'serialized selector payload when present',
					},
				],
			},
			{
				label: 'Created action',
				items: [
					{
						label: 'BlockheadSessionActionView when accepted',
					},
				],
			},
			{
				label: 'Resolution',
				items: [
					{
						label: 'catalog definition key',
					},
					{
						label: 'definition hash',
					},
					'selectedOptionHash',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadIntentInvocation>
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
	entityType={EntityType.BlockheadIntentInvocation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
