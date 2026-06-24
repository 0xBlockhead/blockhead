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
			label: 'regulated asset profile',
		},
		{
			label: 'topic key',
		},
		{
			label: 'claim topic',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'regulated asset profile',
				},
				{
					label: 'topic key',
				},
				{
					label: 'claim topic',
				},
				{
					label: 'required issuer selector',
				},
				{
					label: 'country scope',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Profile',
				items: [
					{
						label: 'parent regulated asset profile',
					},
				],
			},
			{
				label: 'Trusted issuers',
				items: [
					{
						label: 'trusted issuer rows filtered by accepted claim topic',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'registry call/event payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.ClaimTopicRequirement>
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
	entityType={EntityType.ClaimTopicRequirement}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
