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
		'$tableItem',
		'ledgerVersion',
		'source',
	],
	content: {
		dl: [
			[
				'$tableItem',
				'ledgerVersion',
				'source',
				'timestampMs',
				'valueHash',
				'pruned',
				{
					label: 'value summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Table item',
				items: [
					{
						label: 'parent table item identity',
					},
				],
			},
			{
				label: 'Value',
				items: [
					{
						label: 'structured JSON',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'get table item request/response',
					},
					{
						label: 'ledger-version pruning status',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosTableItem_Timestamp>
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
	entityType={EntityType.AptosTableItem_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
