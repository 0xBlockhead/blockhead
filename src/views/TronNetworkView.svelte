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
				label: 'head block',
			},
			{
				label: 'environment',
			},
			{
				label: 'native asset count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'head block',
					},
					{
						label: 'environment',
					},
					{
						label: 'native asset count',
					},
					{
						label: 'REST endpoint availability',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'TRON',
					items: [
						{
							label: 'Blocks',
						},
						{
							label: 'Network snapshots',
						},
						{
							label: 'Witnesses',
						},
						{
							label: 'Endpoints',
						},
					],
				},
				{
					label: 'Assets',
					items: [
						{
							label: 'Native coin',
						},
						{
							label: 'TRC token browse facets',
						},
						{
							label: 'token transfer feeds when source-scoped',
						},
					],
				},
				{
					label: 'Resources',
					items: [
						{
							label: 'Faucets',
						},
						{
							label: 'Block explorers',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronNetwork>
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
	entityType={EntityType.TronNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
