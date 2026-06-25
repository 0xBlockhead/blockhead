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
		'direction',
		'pegTransactionId',
	],
	content: {
		dl: [
			[
				'$network',
				'direction',
				'pegTransactionId',
				'$bitcoinTransaction',
				'$elementsTransaction',
			],
			[
				'amountSats',
				{
					label: 'latest status',
				},
				'claimScript',
				'pakProof',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Bitcoin side',
				items: [
					{
						label: 'Bitcoin-side UTXO transaction',
					},
				],
			},
			{
				label: 'Elements side',
				items: [
					{
						label: 'Elements-side UTXO transaction',
					},
				],
			},
			{
				label: 'Status observations',
				items: [
					{
						label: 'timestamped peg status observations',
					},
				],
			},
			{
				label: 'Proof',
				items: [
					'claimScript',
					{
						label: 'PAK proof evidence',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.ElementsPeg>
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
	entityType={EntityType.ElementsPeg}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
