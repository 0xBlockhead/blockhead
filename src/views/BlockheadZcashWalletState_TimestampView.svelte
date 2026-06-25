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
		'$walletState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$walletState',
				'timestampMs',
				'source',
				{
					label: 'total balance',
				},
				'verifiedBalanceZatoshis',
			],
			[
				'spendableBalanceZatoshis',
				{
					label: 'transparent/Sapling/Orchard balance breakdowns',
				},
				{
					label: 'pending-change value',
				},
				{
					label: 'pending-spendability value',
				},
				'uneconomicValueZatoshis',
			],
			[
				{
					label: 'scan height',
				},
				'chainTipHeight',
				'recoveryState',
				{
					label: 'sync time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Wallet',
				items: [
					{
						label: 'parent local Zcash wallet state',
					},
				],
			},
			{
				label: 'Viewing keys',
				items: [
					{
						label: 'local Zcash viewing keys',
					},
				],
			},
			{
				label: 'Notes',
				items: [
					{
						label: 'local Zcash note states',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'zcashd wallet balance/list RPC payloads',
					},
					{
						label: 'lightwalletd tip/tree state',
					},
					{
						label: 'or local SDK account balance rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashWalletState_Timestamp>
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
	entityType={EntityType.BlockheadZcashWalletState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
