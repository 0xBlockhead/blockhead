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
			label: 'tree',
		},
		'path',
		'mode',
	],
	content: {
		dl: [
			[
				{
					label: 'tree',
				},
				'path',
				'mode',
				{
					label: 'object id',
				},
				{
					label: 'object kind',
				},
				{
					label: 'object link',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parent tree',
				items: [
					{
						label: 'parent Git tree',
					},
				],
			},
			{
				label: 'Target object',
				items: [
					{
						label: 'target Git object',
					},
				],
			},
			{
				label: 'Blob/tree/tag/commit body',
				items: [
					{
						label: 'typed object body when resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitTreeEntry>
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
	entityType={EntityType.GitTreeEntry}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
