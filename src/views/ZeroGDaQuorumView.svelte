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
		'$network',
		'quorumId',
		'$consensusNetwork',
	],
	content: {
		dl: [
			[
				'$network',
				'quorumId',
				'$consensusNetwork',
				'selectionMethod',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'DA nodes',
				items: [
					{
						label: 'node rows in this quorum',
					},
				],
			},
			{
				label: 'Consensus',
				items: [
					{
						label: 'linked consensus-network identity',
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
			{
				label: 'Source evidence',
				items: [
					{
						label: '0G DA/consensus payload exposing quorum id',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'da-nodes',
			label: 'da nodes',
			field: '$$daNodes',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGDaQuorum>
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
	entityType={EntityType.ZeroGDaQuorum}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
