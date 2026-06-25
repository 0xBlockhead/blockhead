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
		'operationHash',
		'$block',
		'branch',
	],
	content: {
		dl: [
			[
				'operationHash',
				'$block',
				'branch',
				{
					label: 'signature presence',
				},
				'validationPass',
				'operationCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Operation contents',
				items: [
					{
						label: 'operations ordered by content index',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'parent Tezos block',
					},
				],
			},
			{
				label: 'Raw payload',
				items: [
					{
						label: 'signed group JSON/Micheline when available',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node/indexer payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'operations',
			label: 'operations',
			field: '$$operations',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosOperationGroup>
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
	entityType={EntityType.TezosOperationGroup}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
