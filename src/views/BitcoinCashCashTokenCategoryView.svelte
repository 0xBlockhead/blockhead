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
		'categoryId',
		{
			label: 'metadata claim',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'categoryId',
				{
					label: 'metadata claim',
				},
				{
					label: 'fungible output count',
				},
				{
					label: 'NFT output count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Metadata',
				items: [
					{
						label: 'BCMR metadata claim by registry URL',
					},
				],
			},
			{
				label: 'Fungible outputs',
				items: [
					{
						label: 'UTXO outputs carrying fungible amount for this category',
					},
				],
			},
			{
				label: 'NFT outputs',
				items: [
					{
						label: 'UTXO outputs carrying NFT data for this category',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent UTXO network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'node tokenData category observations',
					},
					{
						label: 'BCMR registry lookup',
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
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashCashTokenCategory>
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
	entityType={EntityType.BitcoinCashCashTokenCategory}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
