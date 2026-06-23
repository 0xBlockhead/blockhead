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
			'sequence',
			'hash',
			{
				label: 'close time',
			},
		],
		content: {
			dl: [
				[
					'sequence',
					'hash',
					{
						label: 'close time',
					},
					{
						label: 'protocol version',
					},
					{
						label: 'transaction/operation counts',
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
							label: 'transactions in this ledger',
						},
					],
				},
				{
					label: 'Operations',
					items: [
						{
							label: 'operations in this ledger',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Horizon ledger payload',
						},
						{
							label: 'RPC ledger/head payload',
						},
						{
							label: 'explorer ledger stats',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarLedger>
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
	entityType={EntityType.StellarLedger}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
