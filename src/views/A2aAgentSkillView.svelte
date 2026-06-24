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
			label: 'card snapshot',
		},
		{
			label: 'skill id',
		},
		'name',
	],
	content: {
		dl: [
			[
				{
					label: 'card snapshot',
				},
				{
					label: 'skill id',
				},
				'name',
			],
			[
				'tags',
				{
					label: 'input/output modes',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Card snapshot',
				items: [
					{
						label: 'A2aAgentCard_Snapshot',
					},
				],
			},
			{
				label: 'Examples',
				items: [
					{
						label: 'examples payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentSkill>
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
	entityType={EntityType.A2aAgentSkill}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
