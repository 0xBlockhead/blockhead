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
			label: 'patch id',
		},
		'state',
	],
	content: {
		dl: [
			[
				{
					label: 'repository',
				},
				{
					label: 'patch id',
				},
				'state',
				{
					label: 'author DID',
				},
				{
					label: 'target ref',
				},
				{
					label: 'head object id',
				},
				{
					label: 'base object id',
				},
				{
					label: 'created/updated timestamps',
				},
				{
					label: 'head commit',
				},
				{
					label: 'base commit',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Commits',
				items: [
					{
						label: 'head/base Git commits',
					},
				],
			},
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
			selection: EntityProxyResource<typeof schema, EntityType.RadiclePatch>
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
	entityType={EntityType.RadiclePatch}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
