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
		'name',
		'status',
		'protocol',
	],
	content: {
		dl: [
			[
				'name',
				'status',
				'protocol',
				'authorId',
				{
					label: 'created/updated/locked timestamps',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Draft',
				items: [
					{
						label: 'draft text',
					},
					{
						label: 'attachments when modeled',
					},
				],
			},
			{
				label: 'Publication',
				items: [
					{
						label: 'submitted cast/message ids',
					},
					{
						label: 'outcomes when linked',
					},
				],
			},
			{
				label: 'Author',
				items: [
					{
						label: 'local connected-account state',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSocialPostSession>
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
	entityType={EntityType.BlockheadSocialPostSession}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
