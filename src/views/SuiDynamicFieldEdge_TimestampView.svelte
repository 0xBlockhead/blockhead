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
				label: 'edge',
			},
			{
				label: 'checkpoint sequence',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'edge',
					},
					{
						label: 'checkpoint sequence',
					},
					'source',
					{
						label: 'observation time',
					},
					{
						label: 'field type',
					},
					{
						label: 'child object type',
					},
					{
						label: 'deleted state',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Edge',
					items: [
						{
							label: 'parent dynamic-field edge',
						},
					],
				},
				{
					label: 'Parent object',
					items: [
						{
							label: 'parent Sui object through edge',
						},
					],
				},
				{
					label: 'Child object',
					items: [
						{
							label: 'child Sui object when resolved',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'GraphQL/gRPC dynamic field payload',
						},
						{
							label: 'legacy suix_getDynamicFields/suix_getDynamicFieldObject payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiDynamicFieldEdge_Timestamp>
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
	entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
