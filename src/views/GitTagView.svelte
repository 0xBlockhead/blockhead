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
			label: 'target object id',
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
					label: 'target object id',
				},
				{
					label: 'target kind',
				},
				{
					label: 'tag name',
				},
				{
					label: 'tagger selector',
				},
				{
					label: 'tagger timestamp',
				},
				'message',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Target',
				items: [
					{
						label: 'target Git object',
					},
				],
			},
			{
				label: 'Signatures',
				items: [
					{
						label: 'signatures over this tag object',
					},
				],
			},
			{
				label: 'Object',
				items: [
					{
						label: 'parent Git object for the tag',
					},
				],
			},
			{
				label: 'Ref observations',
				items: [
					{
						label: 'matching tag-ref observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitTag>
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
	entityType={EntityType.GitTag}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
