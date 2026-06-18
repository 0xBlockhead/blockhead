<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.CosmosBlock>
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
	entitySelector={selector}
	href={
		'height' in selector ?
			(
				'networkSlug' in selector.$network ?
					`/network/${selector.$network.networkSlug}/blocks/${selector.height.toString()}`
				:
					`/network/${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}/blocks/${selector.height.toString()}`
			)
		:
			undefined
	}
	title={'height' in selector ? `Block #${selector.height.toString()}` : `Block ${selector.hash}`}
	idDragPlainText={'height' in selector ? selector.height.toString() : selector.hash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			{'height' in selector ? `#${selector.height.toString()}` : selector.hash}
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
			resource={select(EntityType.CosmosBlock,
					selector,
					({ sources: [
							Source.CometBft_Rest,
							Source.CosmosSdk_Rest,
						], fields: { hash: true, ...(open && ({ proposerConsensusAddress: true })), timestampMs: true } }),
				)}
			placeholderText="Loading Cosmos block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if block.fields.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={block.fields.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.fields.proposerConsensusAddress != null}
						<div>
							<dt>Proposer consensus address</dt>
							<dd>
								<TruncatedValue
									value={block.fields.proposerConsensusAddress}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.fields.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={block.fields.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
