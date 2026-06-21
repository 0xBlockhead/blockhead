<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.CosmosBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosBlock}
	entitySelector={selection.entitySelector}
	href={
		'height' in selection.entitySelector ?
			(
				'slug' in selection.entitySelector.$network ?
					`/network/${selection.entitySelector.$network.slug}/blocks/${selection.entitySelector.height.toString()}`
				: 'caip2' in selection.entitySelector.$network ?
					`/network/${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}/blocks/${selection.entitySelector.height.toString()}`
				:
					undefined
			)
		:
			undefined
	}
	title={'height' in selection.entitySelector ? `Block #${selection.entitySelector.height.toString()}` : `Block ${selection.entitySelector.hash}`}
	idDragPlainText={'height' in selection.entitySelector ? selection.entitySelector.height.toString() : selection.entitySelector.hash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			{'height' in selection.entitySelector ? `#${selection.entitySelector.height.toString()}` : selection.entitySelector.hash}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Cosmos SDK blocks are CometBFT consensus blocks carrying SDK transactions and module messages.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ sources: [
							Source.CometBft_Rest,
							Source.CosmosSdk_Rest,
						], fields: { hash: true, ...(open && ({ proposerConsensusAddress: true })), timestampMs: true } }),
				)}
			placeholderText="Loading Cosmos block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if block.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={block.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.proposerConsensusAddress != null}
						<div>
							<dt>Proposer consensus address</dt>
							<dd>
								<TruncatedValue
									value={block.proposerConsensusAddress}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={block.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
