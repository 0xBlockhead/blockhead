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
				label: 'account id',
			},
			{
				label: 'latest account snapshot',
			},
			{
				label: 'bounded activity',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account id',
					},
					{
						label: 'latest sequence/native-balance observation',
					},
					{
						label: 'subentry/signer/threshold observation',
					},
				],
				[
					{
						label: 'trustline/offer/trade/transaction windows',
					},
					{
						label: 'signer rows',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account snapshots',
					items: [
						{
							label: 'timestamped account ledger-state observations',
						},
					],
				},
				{
					label: 'Trustlines',
					items: [
						{
							label: 'account trustlines',
						},
					],
				},
				{
					label: 'Offers',
					items: [
						{
							label: 'account SDEX offers',
						},
					],
				},
				{
					label: 'Trades',
					items: [
						{
							label: 'account trades',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'account transaction windows',
						},
					],
				},
				{
					label: 'Signers',
					items: [
						{
							label: 'account signer rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAccount>
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
	entityType={EntityType.StellarAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
