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
			label: 'issue id',
		},
		'title',
	],
	content: {
		dl: [
			[
				{
					label: 'repository',
				},
				{
					label: 'issue id',
				},
				'title',
				'state',
				{
					label: 'author DID',
				},
				{
					label: 'created/updated timestamps',
				},
				{
					label: 'payload object id',
				},
				{
					label: 'payload object',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Comments',
				items: [
					{
						label: 'discussion comments',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'collaboration events',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'Git object payload',
					},
				],
			},
			{
				label: 'Repository',
				items: [
					{
						label: 'parent Radicle repository',
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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleIssue>
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
	entityType={EntityType.RadicleIssue}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
