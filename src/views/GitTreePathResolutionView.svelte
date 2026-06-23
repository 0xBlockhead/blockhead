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
				label: 'repository',
			},
			{
				label: 'commit object id',
			},
			'path',
		],
		content: {
			dl: [
				[
					{
						label: 'repository',
					},
					{
						label: 'commit object id',
					},
					'path',
					'status',
					{
						label: 'terminal blob object id',
					},
					{
						label: 'submodule commit id',
					},
					{
						label: 'traversed tree object ids',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Repository',
					items: [
						{
							label: 'parent Git repository',
						},
					],
				},
				{
					label: 'Commit',
					items: [
						{
							label: 'commit whose root tree is traversed',
						},
					],
				},
				{
					label: 'Traversal',
					items: [
						{
							label: 'tree objects traversed by path segments',
						},
					],
				},
				{
					label: 'Terminal object',
					items: [
						{
							label: 'terminal blob or submodule commit when resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitTreePathResolution>
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
	entityType={EntityType.GitTreePathResolution}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
