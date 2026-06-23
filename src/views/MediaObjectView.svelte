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
			'url',
			{
				label: 'dimensions',
			},
			{
				label: 'MIME/size',
			},
		],
		content: {
			dl: [
				[
					'url',
					'width',
					'height',
					{
						label: 'MIME type',
					},
					'size',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Media',
					items: [
						{
							label: 'Media rows that reference this rendition',
						},
					],
				},
				{
					label: 'Metadata',
					items: [
						{
							label: 'dimensions',
						},
						{
							label: 'MIME type',
						},
						{
							label: 'byte size',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'source payload rendition object',
						},
						{
							label: 'HTTP/content response metadata when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.MediaObject>
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
	entityType={EntityType.MediaObject}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
