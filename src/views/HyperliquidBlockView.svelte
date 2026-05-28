<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.HyperliquidBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const hyperliquidBlock = useEntity(
		EntityType.HyperliquidBlock,
		entityId,
		{
			hash: {},
			timestampMs: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidBlock}
	{entityId}
	title={`Hyperliquid Block ${entityId.height.toString()}`}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.height.toString()}
	{/snippet}

	{#snippet Heading()}
		{entityId.height.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={hyperliquidBlock}
			placeholderText="Loading Hyperliquid block…"
		>
			{#snippet children(hyperliquidBlock)}
				<dl>
					{#if hyperliquidBlock.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={hyperliquidBlock.hash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if hyperliquidBlock.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={hyperliquidBlock.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
