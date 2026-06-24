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
		'variant',
		'label',
		{
			label: 'scope',
		},
	],
	content: {
		dl: [
			[
				'variant',
				'label',
				{
					label: 'FID/channel/viewer selector',
				},
				{
					label: 'entry count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Entries',
				items: [
					{
						label: 'FarcasterCast rows returned for this feed request',
					},
				],
			},
			{
				label: 'Scope',
				items: [
					{
						label: 'trending/by-user/by-channel/following selector fields',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Farcaster_Rest feed route and pagination context',
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterFeed>
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
	entityType={EntityType.FarcasterFeed}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
