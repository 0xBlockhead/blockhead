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
			{
				label: 'frame number',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'shard key',
					},
					{
						label: 'frame number',
					},
				],
				[
					{
						label: 'network',
					},
					{
						label: 'frame number',
					},
					{
						label: 'shard key',
					},
					{
						label: 'frame hash',
					},
					{
						label: 'timestamp',
					},
					'difficulty',
					{
						label: 'shard',
					},
					{
						label: 'prover when sourced',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Shard',
					items: [
						{
							label: 'parent Quilibrium shard',
						},
					],
				},
				{
					label: 'Prover',
					items: [
						{
							label: 'linked Quilibrium prover',
						},
					],
				},
				{
					label: 'Node observations',
					items: [
						{
							label: 'BlockheadQuilibriumNodeState rows whose latest/frame-store head reached this frame',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'node RPC frame payload',
						},
						{
							label: 'endpoint freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.QuilibriumFrame>
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
	entityType={EntityType.QuilibriumFrame}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
