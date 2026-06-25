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
		'issueNumber',
		'title',
	],
	content: {
		dl: [
			[
				'$forgeMirror',
				'issueNumber',
				'title',
				'state',
				'authorSelector',
				'labels',
				{
					label: 'created/updated/closed timestamps',
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
				label: 'Timeline',
				items: [
					{
						label: 'issue comments/events when modeled',
					},
				],
			},
			{
				label: 'References',
				items: [
					{
						label: 'linked commits/PRs when parsed from source payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitForgeIssue>
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
	entityType={EntityType.GitForgeIssue}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
