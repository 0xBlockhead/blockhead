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
				label: 'pack hash',
			},
			{
				label: 'object id',
			},
			{
				label: 'object format',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'pack hash',
					},
					{
						label: 'object id',
					},
					{
						label: 'object format',
					},
					{
						label: 'stored kind',
					},
					'offset',
					{
						label: 'delta base object id',
					},
					{
						label: 'packfile',
					},
					{
						label: 'parsed object',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Packfile',
					items: [
						{
							label: 'parent Git packfile',
						},
					],
				},
				{
					label: 'Object',
					items: [
						{
							label: 'parsed Git object when available',
						},
					],
				},
				{
					label: 'Verification',
					items: [
						{
							label: 'verification observations for this packed byte source',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitPackedObject>
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
	entityType={EntityType.GitPackedObject}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
