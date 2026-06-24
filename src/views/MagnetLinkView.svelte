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
			label: 'magnet URI',
		},
		{
			label: 'info hash',
		},
		{
			label: 'display name',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'magnet URI',
				},
				{
					label: 'info hash',
				},
				{
					label: 'display name',
				},
				{
					label: 'exact length',
				},
				{
					label: 'tracker count',
				},
				{
					label: 'web seed count',
				},
				{
					label: 'acceptable source count',
				},
				{
					label: 'linked torrent',
				},
				{
					label: 'resolution count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parameters',
				items: [
					{
						label: 'grouped xt/dn/xl/tr/ws/as values',
					},
				],
			},
			{
				label: 'Trackers',
				items: [
					{
						label: 'tracker URLs from tr parameters',
					},
				],
			},
			{
				label: 'Torrent',
				items: [
					{
						label: 'linked metainfo row when resolved',
					},
				],
			},
			{
				label: 'Resolution history',
				items: [
					{
						label: 'timestamped resolution attempts',
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
			selection: EntityProxyResource<typeof schema, EntityType.MagnetLink>
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
	entityType={EntityType.MagnetLink}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
