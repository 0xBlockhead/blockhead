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
			label: 'repository id',
		},
		{
			label: 'canonical remote URL',
		},
		{
			label: 'object format',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'repository id',
				},
				{
					label: 'canonical remote URL',
				},
				{
					label: 'object format',
				},
				{
					label: 'default ref',
				},
				{
					label: 'remote count',
				},
				{
					label: 'object count',
				},
				{
					label: 'ref count',
				},
				{
					label: 'latest fetch status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Refs',
				items: [
					{
						label: 'GitRef list grouped by heads/tags/symbolic refs',
					},
				],
			},
			{
				label: 'Objects',
				items: [
					{
						label: 'GitObject list grouped by commit/tree/blob/tag',
					},
				],
			},
			{
				label: 'Remotes',
				items: [
					{
						label: 'GitRemote list',
					},
				],
			},
			{
				label: 'Fetches',
				items: [
					{
						label: 'GitFetchObservation history',
					},
				],
			},
			{
				label: 'Forge mirrors',
				items: [
					{
						label: 'GitForgeMirror list',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitRepository>
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
	entityType={EntityType.GitRepository}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
