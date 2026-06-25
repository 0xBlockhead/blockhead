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
		'type',
		'transport',
	],
	content: {
		dl: [
			[
				'url',
				'type',
				'transport',
				'hash',
			],
			[
				'$original',
				'$thumbnail',
				'$low',
				'$medium',
				{
					label: 'high rendition objects',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Renditions',
				items: [
					{
						label: 'MediaObject refs for original/thumbnail/low/medium/high',
					},
				],
			},
			{
				label: 'Usage',
				items: [
					{
						label: 'parent entities that reference this media URL',
					},
				],
			},
			{
				label: 'Transport',
				items: [
					{
						label: 'HTTP/IPFS/Arweave classification from URL normalization',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'derived mediaFromUrl output and source payload URL',
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
			selection: EntityProxyResource<typeof schema, EntityType.Media>
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
	entityType={EntityType.Media}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
