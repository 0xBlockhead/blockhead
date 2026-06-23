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
				label: 'mint',
			},
			'method',
			{
				label: 'quote id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'mint',
					},
					'method',
					{
						label: 'quote id',
					},
					{
						label: 'payment request',
					},
					'unit',
					'amount',
					{
						label: 'latest observed state',
					},
					{
						label: 'latest expiry',
					},
					{
						label: 'wallet state',
					},
					{
						label: 'timestamp count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest state',
					items: [
						{
							label: 'BlockheadCashuMintQuote_TimestampView',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'BlockheadCashuMintQuote_TimestampsView',
						},
					],
				},
				{
					label: 'Mint',
					items: [
						{
							label: 'CashuMintView',
						},
					],
				},
				{
					label: 'Payment request',
					items: [
						{
							label: 'BOLT11/BOLT12/onchain request text',
						},
					],
				},
				{
					label: 'Wallet',
					items: [
						{
							label: 'BlockheadCashuWalletStateView',
						},
					],
				},
				{
					label: 'Outputs',
					items: [
						{
							label: 'local blinded-message/signature summary only in trusted local contexts',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuMintQuote>
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
	entityType={EntityType.BlockheadCashuMintQuote}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
