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
			label: 'block number/hash',
		},
		'dataSubmissionCount',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$network',
				'blockNumber',
				'blockHash',
				'parentHash',
				'timestampMs',
				'extrinsicCount',
			],
			[
				'dataSubmissionCount',
				'appIdCount',
				'stateRoot',
				'extrinsicsRoot',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Data submissions',
				items: [
					{
						label: 'data submissions included in this block',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Avail network',
					},
				],
			},
			{
				label: 'Header',
				items: [
					{
						label: 'parent/state/extrinsics roots',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'Substrate block/header RPC by number or hash',
					},
					{
						label: 'indexer block payload',
					},
					{
						label: 'DA extrinsic scan coverage',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'data-submissions',
			label: 'data submissions',
			field: '$$dataSubmissions',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvailBlock>
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
	entityType={EntityType.AvailBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
