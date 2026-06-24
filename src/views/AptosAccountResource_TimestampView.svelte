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
			label: 'resource',
		},
		{
			label: 'ledger version',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'resource',
				},
				{
					label: 'ledger version',
				},
				'source',
				{
					label: 'observed time',
				},
				'value',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Resource',
				items: [
					{
						label: 'AptosAccountResource',
					},
				],
			},
			{
				label: 'Ledger context',
				items: [
					{
						label: 'ledger version',
					},
					{
						label: 'observed time',
					},
					'source',
				],
			},
			{
				label: 'Value',
				items: [
					{
						label: 'JSON value at ledger version',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'fullnode account/resource response',
					},
					{
						label: 'indexer resource payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosAccountResource_Timestamp>
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
	entityType={EntityType.AptosAccountResource_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
