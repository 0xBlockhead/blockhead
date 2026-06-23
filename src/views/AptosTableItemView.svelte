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
				label: 'table handle',
			},
			{
				label: 'key hash',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'table handle',
					},
					{
						label: 'key hash',
					},
					{
						label: 'key type',
					},
					{
						label: 'value type',
					},
					{
						label: 'key summary',
					},
					{
						label: 'latest value/hash summary',
					},
					{
						label: 'latest ledger version/source',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Value observations',
					items: [
						{
							label: 'ledger-versioned table item values',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent Aptos network',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'table item request body',
						},
						{
							label: 'response',
						},
						{
							label: 'pruning/freshness status',
						},
						{
							label: 'indexer coordinates',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosTableItem>
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
	entityType={EntityType.AptosTableItem}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
