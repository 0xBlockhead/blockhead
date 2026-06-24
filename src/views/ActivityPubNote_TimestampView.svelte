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
			label: 'note',
		},
		{
			label: 'observation time',
		},
		{
			label: 'favourites',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'note',
				},
				{
					label: 'observation time',
				},
				{
					label: 'favourite count',
				},
				{
					label: 'reblog count',
				},
				{
					label: 'reply count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Note',
				items: [
					{
						label: 'parent ActivityPub note identity',
					},
				],
			},
			{
				label: 'Engagement',
				items: [
					{
						label: 'favourite/reblog/reply counts',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Mastodon/Fedi status counters',
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
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubNote_Timestamp>
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
	entityType={EntityType.ActivityPubNote_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
