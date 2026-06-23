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
			'address',
			{
				label: 'latest balance',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'address',
					{
						label: 'latest balance',
					},
					{
						label: 'latest UTXO count',
					},
					{
						label: 'transaction count',
					},
					{
						label: 'source freshness',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transactions',
					items: [
						{
							label: 'Kaspa transaction rows involving this address',
						},
					],
				},
				{
					label: 'UTXOs',
					items: [
						{
							label: 'address UTXO observations grouped by outpoint',
						},
					],
				},
				{
					label: 'Balance snapshots',
					items: [
						{
							label: 'timestamped balance observations',
						},
					],
				},
				{
					label: 'Related outputs',
					items: [
						{
							label: 'resolved UTXO outputs',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'node/indexer address payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaAddress>
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
	entityType={EntityType.KaspaAddress}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
