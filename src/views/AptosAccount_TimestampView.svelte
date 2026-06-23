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
				label: 'account',
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
						label: 'account',
					},
					{
						label: 'ledger version',
					},
					'source',
					{
						label: 'observation time',
					},
					{
						label: 'block height',
					},
					'epoch',
					{
						label: 'sequence number',
					},
					{
						label: 'authentication key',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'parent Aptos account',
						},
					],
				},
				{
					label: 'Resources',
					items: [
						{
							label: 'resource observations at the same ledger version when available',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'transactions around the sequence/ledger version',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'fullnode account response headers',
						},
						{
							label: 'indexer account payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosAccount_Timestamp>
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
	entityType={EntityType.AptosAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
