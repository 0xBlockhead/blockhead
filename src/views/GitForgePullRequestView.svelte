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
		'$forgeMirror',
		{
			label: 'number',
		},
		'title',
	],
	content: {
		dl: [
			[
				'$forgeMirror',
				{
					label: 'number',
				},
				'title',
				'state',
				'authorSelector',
			],
			[
				'baseRef',
				'headRef',
				'headObjectId',
				{
					label: 'created/updated/merged timestamps',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Forge mirror',
				items: [
					'$forgeMirror',
				],
			},
			{
				label: 'Head commit',
				items: [
					{
						label: 'head Git commit when resolved',
					},
				],
			},
			{
				label: 'Base/head refs',
				items: [
					{
						label: 'base/head Git refs',
					},
				],
			},
			{
				label: 'Activity',
				items: [
					{
						label: 'reviews/comments/checks when modeled',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitForgePullRequest>
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
	entityType={EntityType.GitForgePullRequest}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
