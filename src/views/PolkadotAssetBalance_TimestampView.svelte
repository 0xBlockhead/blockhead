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
		'$account',
		'$asset',
		'timestampMs',
	],
	content: {
		dl: [
			[
				'$account',
				'$asset',
				'timestampMs',
				'source',
				{
					label: 'block number/hash',
				},
			],
			[
				{
					label: 'free/reserved/frozen/transferable/locked balances',
				},
				'status',
				'reason',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent Polkadot account',
					},
				],
			},
			{
				label: 'Asset',
				items: [
					{
						label: 'parent Polkadot asset',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'Polkadot block when coordinates are present',
					},
				],
			},
			{
				label: 'Transfers/extrinsics',
				items: [
					{
						label: 'extrinsics filtered by account/asset when indexed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'runtime storage/indexer balance payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAssetBalance_Timestamp>
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
	entityType={EntityType.PolkadotAssetBalance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
