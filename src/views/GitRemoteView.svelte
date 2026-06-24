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
			label: 'remote name',
		},
		{
			label: 'URL',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'repository',
				},
				{
					label: 'remote name',
				},
				{
					label: 'URL',
				},
				{
					label: 'transport kind',
				},
				{
					label: 'host kind',
				},
				'source',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Fetches',
				items: [
					{
						label: 'fetch observations for this remote',
					},
				],
			},
			{
				label: 'Forge mirror',
				items: [
					{
						label: 'forge mirror when URL resolves to one',
					},
				],
			},
			{
				label: 'Repository',
				items: [
					{
						label: 'parent Git repository',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitRemote>
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
	entityType={EntityType.GitRemote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
