<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	lists: [
		{
			id: 'balances',
			label: 'Balances',
			emptyText: 'No balances for this wallet yet.',
			item: 'summary',
		},
	],
	closed: [
		'id',
		'name',
		'protocol',
		{
			label: 'transport',
		},
	],
	content: {
		dl: [
			[
				'id',
				'name',
				'protocol',
				{
					label: 'discovery kind',
				},
				{
					label: 'transport kind',
				},
				{
					label: 'connection method',
				},
				'rdns',
				{
					label: 'website URL',
				},
			],
			[
				{
					label: 'adapter id',
				},
				{
					label: 'source wallet key',
				},
				{
					label: 'detected time',
				},
				'capabilities',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Connection method',
				items: [
					{
						label: 'WalletConnectionMethod',
					},
				],
			},
			{
				label: 'Connections',
				items: [
					{
						label: 'BlockheadWalletConnection rows for this wallet candidate',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'BlockheadWalletAccount rows exposed through connections',
					},
				],
			},
			{
				label: 'Discovery evidence',
				items: [
					{
						label: 'injected event/global/registry/manifest/source fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWallet>
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
	entityType={EntityType.BlockheadWallet}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
