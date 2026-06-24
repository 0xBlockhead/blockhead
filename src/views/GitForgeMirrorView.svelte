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
			label: 'host',
		},
		'owner',
		{
			label: 'repository name',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'host',
				},
				'owner',
				{
					label: 'repository name',
				},
				{
					label: 'provider repository id',
				},
				'visibility',
				{
					label: 'default branch',
				},
				{
					label: 'clone URLs',
				},
				{
					label: 'HTML URL',
				},
				'source',
				{
					label: 'linked Git repository',
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
						label: 'linked Git repository when clone/object evidence ties it',
					},
				],
			},
			{
				label: 'Pull requests',
				items: [
					{
						label: 'forge pull request records',
					},
				],
			},
			{
				label: 'Issues',
				items: [
					{
						label: 'forge issue records',
					},
				],
			},
			{
				label: 'Releases',
				items: [
					{
						label: 'forge release records',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitForgeMirror>
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
	entityType={EntityType.GitForgeMirror}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
