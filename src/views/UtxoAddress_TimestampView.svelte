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
		'$address',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$address',
				'timestampMs',
				'source',
				{
					label: 'confirmed balance',
				},
				{
					label: 'funded/spent output counts',
				},
			],
			[
				{
					label: 'values',
				},
				'transactionCount',
				'unspentOutputCount',
				'mempoolTransactionCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Address',
				items: [
					{
						label: 'parent address projection',
					},
				],
			},
			{
				label: 'UTXOs',
				items: [
					{
						label: 'unspent outputs when source payload includes them',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transaction history when source payload includes it',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'address stats payload',
					},
					{
						label: 'pagination cursor/range',
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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoAddress_Timestamp>
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
	entityType={EntityType.UtxoAddress_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
