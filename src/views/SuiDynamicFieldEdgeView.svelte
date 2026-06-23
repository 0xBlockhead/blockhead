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
				label: 'parent object',
			},
			{
				label: 'field name hash/value',
			},
			{
				label: 'child object id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'parent object',
					},
					{
						label: 'field name hash/value',
					},
					{
						label: 'child object id',
					},
					{
						label: 'latest field/child type',
					},
					{
						label: 'latest observation time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'State observations',
					items: [
						{
							label: 'checkpoint/source dynamic-field observations',
						},
					],
				},
				{
					label: 'Parent object',
					items: [
						{
							label: 'parent Sui object',
						},
					],
				},
				{
					label: 'Child object',
					items: [
						{
							label: 'child Sui object when child id resolves',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'dynamic field listing/read payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiDynamicFieldEdge>
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
	entityType={EntityType.SuiDynamicFieldEdge}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
