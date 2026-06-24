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
			label: 'forge mirror',
		},
		{
			label: 'release tag name',
		},
		'name',
	],
	content: {
		dl: [
			[
				{
					label: 'forge mirror',
				},
				{
					label: 'release tag name',
				},
				'name',
				{
					label: 'target object id',
				},
				{
					label: 'author selector',
				},
				{
					label: 'draft/prerelease flags',
				},
				{
					label: 'created timestamp',
				},
				{
					label: 'published timestamp',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Forge mirror',
				items: [
					{
						label: 'parent forge mirror',
					},
				],
			},
			{
				label: 'Tag/ref',
				items: [
					{
						label: 'Git tag or ref when resolved',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'downloadable release assets when modeled',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitForgeRelease>
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
	entityType={EntityType.GitForgeRelease}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
