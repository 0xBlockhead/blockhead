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
				label: 'linked Network',
			},
			{
				label: 'latest validated ledger/range snapshot',
			},
			{
				label: 'load factor',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked Network',
					},
					{
						label: 'latest validated ledger/range snapshot',
					},
					{
						label: 'load factor',
					},
					{
						label: 'peer count',
					},
					{
						label: 'native XRP asset',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Ledgers',
					items: [
						{
							label: 'validated ledgers',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'ledger transactions',
						},
					],
				},
				{
					label: 'Accounts',
					items: [
						{
							label: 'XRPL accounts',
						},
					],
				},
				{
					label: 'Ledger entries',
					items: [
						{
							label: 'ledger object entries',
						},
					],
				},
				{
					label: 'Amendments',
					items: [
						{
							label: 'amendment feature gates',
						},
					],
				},
				{
					label: 'AMMs',
					items: [
						{
							label: 'AMM ledger objects',
						},
					],
				},
				{
					label: 'Network snapshots',
					items: [
						{
							label: 'node/network observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplNetwork>
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
	entityType={EntityType.XrplNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
