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
				label: 'offer',
			},
			'amount',
			'price',
		],
		content: {
			dl: [
				[
					{
						label: 'offer',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'ledger sequence',
					},
					'amount',
					'price',
				],
				[
					'sponsor',
					{
						label: 'active state',
					},
					{
						label: 'last modified time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Offer',
					items: [
						{
							label: 'parent Stellar offer',
						},
					],
				},
				{
					label: 'Ledger',
					items: [
						{
							label: 'Stellar ledger when resolved',
						},
					],
				},
				{
					label: 'Seller',
					items: [
						{
							label: 'seller Stellar account',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Horizon offer payload',
						},
						{
							label: 'RPC ledger entry snapshot',
						},
						{
							label: 'historical offer effects when needed',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarOffer_Timestamp>
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
	entityType={EntityType.StellarOffer_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
