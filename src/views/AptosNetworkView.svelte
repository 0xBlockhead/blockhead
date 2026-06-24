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
			label: 'latest ledger version/block/chain id snapshot',
		},
		{
			label: 'epoch',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'linked Network',
				},
				{
					label: 'latest ledger version/block/chain id snapshot',
				},
				{
					label: 'epoch',
				},
				{
					label: 'execution environment',
				},
				{
					label: 'account count',
				},
				{
					label: 'module count',
				},
				{
					label: 'transaction count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blocks',
				items: [
					{
						label: 'block rows by height/version range',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transaction rows by version/hash',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'account rows',
					},
				],
			},
			{
				label: 'Modules',
				items: [
					{
						label: 'published Move modules',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'transaction event rows',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'account coin-balance observations',
					},
				],
			},
			{
				label: 'Network snapshots',
				items: [
					{
						label: 'ledger-head and node-retention observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.AptosNetwork>
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
	entityType={EntityType.AptosNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
