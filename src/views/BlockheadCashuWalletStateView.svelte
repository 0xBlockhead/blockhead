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
				label: 'wallet id',
			},
			{
				label: 'mint',
			},
			'unit',
		],
		content: {
			dl: [
				[
					{
						label: 'wallet id',
					},
					{
						label: 'mint',
					},
					'unit',
					{
						label: 'latest balance',
					},
					{
						label: 'latest proof count',
					},
					{
						label: 'latest active keyset count',
					},
					{
						label: 'latest pending mint/melt quote counts',
					},
					{
						label: 'latest sync time',
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
							label: 'BlockheadCashuWalletState_TimestampView',
						},
					],
				},
				{
					label: 'State history',
					items: [
						{
							label: 'BlockheadCashuWalletState_TimestampsView',
						},
					],
				},
				{
					label: 'Proofs',
					items: [
						{
							label: 'BlockheadCashuProof list',
						},
					],
				},
				{
					label: 'Tokens',
					items: [
						{
							label: 'BlockheadCashuToken list',
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
					label: 'Quotes',
					items: [
						{
							label: 'BlockheadCashuMintQuote/BlockheadCashuMeltQuote rows known to the wallet',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuWalletState>
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
	entityType={EntityType.BlockheadCashuWalletState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
