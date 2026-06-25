<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	actions: [
		{
			id: 'copy-url',
			label: 'Copy URL',
			kind: 'copy',
			field: 'url',
		},
		{
			id: 'open-url',
			label: 'Open URL',
			kind: 'externalLink',
			field: 'url',
		},
	],
	closed: [
		'url',
		'$$previewTimestamps',
	],
	content: {
		dl: [
			[
				'url',
				'$$previewTimestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Preview history',
				items: [
					{
						label: 'preview observations sorted newest first',
					},
				],
			},
			{
				label: 'References',
				items: [
					{
						label: 'parent rows that link this URL',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'catalog rows',
					},
					{
						label: 'preview extractor payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'preview-timestamps',
			label: 'preview timestamps',
			field: '$$previewTimestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Url>
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
	entityType={EntityType.Url}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
