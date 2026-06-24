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
			label: 'shard key',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'shard key',
				},
			],
			[
				{
					label: 'network',
				},
				{
					label: 'shard key',
				},
				{
					label: 'shard kind',
				},
				{
					label: 'application account',
				},
				{
					label: 'frame count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Frames',
				items: [
					{
						label: 'frames in this shard',
					},
				],
			},
			{
				label: 'Application account',
				items: [
					{
						label: 'linked Quilibrium account',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node RPC shard/frame payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.QuilibriumShard>
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
	entityType={EntityType.QuilibriumShard}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
