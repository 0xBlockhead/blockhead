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
		'height',
		'hash',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'height',
				'hash',
				{
					label: 'parent',
				},
				{
					label: 'timestamp',
				},
				{
					label: 'transaction count',
				},
				{
					label: 'size',
				},
				{
					label: 'weight',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Header',
				items: [
					{
						label: 'merkle root',
					},
					'nonce',
					'difficulty',
					{
						label: 'size/weight',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions in block',
					},
				],
			},
			{
				label: 'Parent',
				items: [
					{
						label: 'parent block',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent UTXO-family network',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'node getblock hash lookup',
					},
					{
						label: 'Esplora/mempool.space height-to-hash lookup',
					},
					{
						label: 'explorer block payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoBlock>
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
	entityType={EntityType.UtxoBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
