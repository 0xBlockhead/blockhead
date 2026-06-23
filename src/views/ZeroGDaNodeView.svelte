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
				label: 'network',
			},
			{
				label: 'node id',
			},
			{
				label: 'quorum',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'node id',
					},
					{
						label: 'quorum',
					},
					{
						label: 'operator',
					},
					'endpoint',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Quorum',
					items: [
						{
							label: 'linked DA quorum',
						},
					],
				},
				{
					label: 'Operator',
					items: [
						{
							label: 'operator EVM account when resolved',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent 0G network',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGDaNode>
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
	entityType={EntityType.ZeroGDaNode}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
