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
		'$meltQuote',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$meltQuote',
				'timestampMs',
				'source',
				'state',
				'expiryMs',
				{
					label: 'payment preimage status',
				},
				'subscriptionId',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Melt quote',
				items: [
					{
						label: 'BlockheadCashuMeltQuoteView',
					},
				],
			},
			{
				label: 'Mint',
				items: [
					{
						label: 'CashuMintView through the quote',
					},
				],
			},
			{
				label: 'Payment proof',
				items: [
					{
						label: 'payment preimage when present',
					},
				],
			},
			{
				label: 'Input proofs',
				items: [
					{
						label: 'BlockheadCashuProof list from the quote',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'NUT-05 quote-state response',
					},
					{
						label: 'melt execution response',
					},
					{
						label: 'or NUT-17 websocket notification',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuMeltQuote_Timestamp>
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
	entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
