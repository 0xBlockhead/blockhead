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
			label: 'URL',
		},
		{
			label: 'timestamp',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'URL',
				},
				{
					label: 'timestamp',
				},
				'source',
				{
					label: 'status',
				},
				'title',
				{
					label: 'site name',
				},
				'description',
				{
					label: 'image URL',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'URL',
				items: [
					{
						label: 'parent URL row',
					},
				],
			},
			{
				label: 'Preview',
				items: [
					'title',
					{
						label: 'site name',
					},
					'description',
					{
						label: 'status',
					},
				],
			},
			{
				label: 'Image',
				items: [
					{
						label: 'embedded image URL/MIME/dimensions from this preview source',
					},
				],
			},
			{
				label: 'History context',
				items: [
					{
						label: 'sibling observations for the same Url sorted newest first',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'extracted Open Graph/card payload when exposed',
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
			selection: EntityProxyResource<typeof schema, EntityType.UrlPreview_Timestamp>
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
	entityType={EntityType.UrlPreview_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
