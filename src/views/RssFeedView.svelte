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
			label: 'feed URL',
		},
		'title',
		{
			label: 'item count',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'feed URL',
				},
				'title',
				'description',
				{
					label: 'site/link URL',
				},
				'language',
				{
					label: 'last build date',
				},
				{
					label: 'image URL',
				},
			],
			[
				{
					label: 'item count',
				},
				{
					label: 'target latest metadata observation when timestamp rows exist',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Items',
				items: [
					{
						label: 'RSS items from this feed',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'publisher-declared title/description/link/site/language/image fields',
					},
				],
			},
			{
				label: 'Metadata observations',
				items: [
					{
						label: 'RssFeed_Timestamp target rows when implemented',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'configured feed URL',
					},
					{
						label: 'direct XML fetch',
					},
					{
						label: 'Rss2Json proxy payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.RssFeed>
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
	entityType={EntityType.RssFeed}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
