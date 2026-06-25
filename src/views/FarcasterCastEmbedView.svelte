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
		'$cast',
		{
			label: 'embed index',
		},
		'url',
	],
	content: {
		dl: [
			[
				'$cast',
				{
					label: 'embed index',
				},
				'url',
				'$embeddedCast',
				'title',
			],
			[
				'description',
				{
					label: 'icon URL/media',
				},
				'quotedPreviewText',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Embedded cast',
				items: [
					{
						label: 'quoted/embedded cast when present',
					},
				],
			},
			{
				label: 'URL preview',
				items: [
					{
						label: 'resolved URL metadata and embedded media fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterCastEmbed>
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
	entityType={EntityType.FarcasterCastEmbed}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
