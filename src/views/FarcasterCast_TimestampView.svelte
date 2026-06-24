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
			label: 'cast',
		},
		{
			label: 'observation time',
		},
		{
			label: 'likes',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'cast',
				},
				{
					label: 'observation time',
				},
				{
					label: 'likes',
				},
				{
					label: 'recasts',
				},
				{
					label: 'replies',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Cast',
				items: [
					{
						label: 'FarcasterCast',
					},
				],
			},
			{
				label: 'Engagement',
				items: [
					{
						label: 'like count',
					},
					{
						label: 'recast count',
					},
					{
						label: 'reply count',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'FarcasterCast_Timestamp list',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Neynar/Snapchain cast payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterCast_Timestamp>
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
	entityType={EntityType.FarcasterCast_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
