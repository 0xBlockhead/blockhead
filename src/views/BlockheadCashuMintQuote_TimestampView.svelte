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
				label: 'mint quote',
			},
			{
				label: 'observation time',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'mint quote',
					},
					{
						label: 'observation time',
					},
					'source',
					'state',
					{
						label: 'expiry',
					},
					{
						label: 'subscription id',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Mint quote',
					items: [
						{
							label: 'BlockheadCashuMintQuoteView',
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
					label: 'Output issuance',
					items: [
						{
							label: 'local blinded output/signature summary when captured',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'NUT-04 quote-state response',
						},
						{
							label: 'mint execution response',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuMintQuote_Timestamp>
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
	entityType={EntityType.BlockheadCashuMintQuote_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
