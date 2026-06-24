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
			label: 'object id',
		},
		{
			label: 'object format',
		},
		{
			label: 'object link',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'object id',
				},
				{
					label: 'object format',
				},
				{
					label: 'object link',
				},
				{
					label: 'entry count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Entries',
				items: [
					{
						label: 'tree entries grouped by file/tree/symlink/submodule modes',
					},
				],
			},
			{
				label: 'Object',
				items: [
					{
						label: 'parent Git object',
					},
				],
			},
			{
				label: 'Commits',
				items: [
					{
						label: 'commits whose root tree matches when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitTree>
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
	entityType={EntityType.GitTree}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
