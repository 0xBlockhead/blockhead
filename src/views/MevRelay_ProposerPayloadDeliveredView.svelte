<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
			caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
		}),
		layout,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.MevRelay_ProposerPayloadDelivered>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const mevRelayProposerPayloadDelivered = $derived(select(
		EntityType.MevRelay_ProposerPayloadDelivered,
		selector,
		{
			sources: [
				Source.MevRelay_Rest,
			],
		},
	))
	
	
	



	// (Derived)
	const payloadSelectorKey = $derived(
		stringify(selector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay_ProposerPayloadDelivered}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title={`Slot ${String(selector.slot)}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.slot}
		</span>
	{/snippet}

	{#snippet Title()}
		<span>
			{selector.slot}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			MEV-Boost-style relays intermediate auctions between block builders and proposing validators; published traces record which builder execution payload won a given consensus slot.
		</p>
		<p>
			Relay schemas vary: some include the accepted EL block hash or height with the bid, others deliveredPayloads only bid value and builder pubkey until cross-linked elsewhere.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary resource={mevRelayProposerPayloadDelivered.field('value')} placeholderText="Loading builder bid value…">
				{#snippet children(value)}
					{#if value !== undefined}
						<div>
							<dt>Value</dt>
							<dd><NumberValue value={value} /> wei</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={mevRelayProposerPayloadDelivered.builderPubkey} placeholderText="Loading builder pubkey…">
				{#snippet children(builderPubkey)}
					{#if builderPubkey !== undefined}
						<div>
							<dt>Builder pubkey</dt>
							<dd>
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									startLength={10}
									endLength={8}
									value={builderPubkey}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open })}
		<CollapsibleTabs
			id={`${payloadSelectorKey}:carousel-payload`}
			sectionIdPrefix={payloadSelectorKey}
			sections={[
				{ id: 'mev-included-block', label: 'Block' },
				] as const}
				data-card
				>
				{#snippet Summary({
				open: _isOpen,
				})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<Heading>
						Block
					</Heading>
					<Tooltip contentProps={{ side: 'top' }}>
						{#snippet Content()}
							<p>
								The execution block ties the winning relay bid to a specific EL block header the builder committed for that validator duty.
							</p>
							<p>
								When the trace omits that linkage, only bid-side fields (value, builder identity) are available until matched out of band.
							</p>
						{/snippet}
						<abbr
							class="entity-heading-tip"
							aria-label="Execution block notes"
						>ⓘ</abbr>
					</Tooltip>
				</header>
				{/snippet}

				{#snippet SectionMevIncludedBlock()}
					<ResourceBoundary
						resource={mevRelayProposerPayloadDelivered.$executionBlock}
						placeholderText="Loading block…"
					>
						{#snippet children(executionBlock)}
							{#if (
								open
								&& executionBlock !== undefined
							)}
								<EvmBlockView
									selector={executionBlock.entitySelector}
									layout={EntityLayout.Summary}
								/>
							{:else if open}
								<div data-row="wrap align-center gap-2">
									<p data-text="muted">
										No execution block linked yet.
									</p>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>
												Resolving the included EL header for a proposer-delivered (MEV-Boost) payload can lag until the relay or indexers tie bid metadata to an execution block.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Execution block resolution"
										>ⓘ</abbr>
									</Tooltip>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
