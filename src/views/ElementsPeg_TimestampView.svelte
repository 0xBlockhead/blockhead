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
			label: 'peg',
		},
		{
			label: 'observation time',
		},
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'peg',
				},
				{
					label: 'observation time',
				},
				'source',
				'status',
				'confirmations',
				{
					label: 'observed Bitcoin height',
				},
				{
					label: 'observed Elements height',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Peg',
				items: [
					{
						label: 'parent Elements peg',
					},
				],
			},
			{
				label: 'Bitcoin side',
				items: [
					{
						label: 'Bitcoin-side UTXO transaction when resolved',
					},
				],
			},
			{
				label: 'Elements side',
				items: [
					{
						label: 'Elements-side UTXO transaction when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'explorer/indexer status payload',
					},
					{
						label: 'block-height freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsPeg_Timestamp>
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
	entityType={EntityType.ElementsPeg_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
