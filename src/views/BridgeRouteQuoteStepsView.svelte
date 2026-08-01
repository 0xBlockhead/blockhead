<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Quote steps',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BridgeRouteQuoteStep> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeRouteQuoteStep}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInQuote: true,
				tool: true,
				stepType: true,
			},
		})
	}
>
	{#snippet Item({ item: bridgeRouteQuoteStep })}
		{@const bridgeRouteQuoteStepSelector = bridgeRouteQuoteStep[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BridgeRouteQuoteStep}
			entitySelector={bridgeRouteQuoteStepSelector}
		>
			{#snippet Title()}
				{`Step #${bridgeRouteQuoteStepSelector.indexInQuote}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(bridgeRouteQuoteStep.tool ?? ''), (bridgeRouteQuoteStep.stepType ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
