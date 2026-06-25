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
		'$quote',
		'timestampMs',
		'source',
		{
			label: 'quote id/solver',
		},
	],
	content: {
		dl: [
			[
				'$quote',
				'timestampMs',
				'source',
				'quoteId',
				'solverId',
			],
			[
				'validUntil',
				'estimatedFillSeconds',
				'quotePayloadHash',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Quote request',
				items: [
					{
						label: 'BlockheadIntentQuoteView',
					},
				],
			},
			{
				label: 'Preview',
				items: [
					{
						label: 'provider input/output preview',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'backend-specific quote payload retained only when needed',
					},
				],
			},
			{
				label: 'Integrity',
				items: [
					{
						label: 'checksum/expiry/source freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadIntentQuote_Timestamp>
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
	entityType={EntityType.BlockheadIntentQuote_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
