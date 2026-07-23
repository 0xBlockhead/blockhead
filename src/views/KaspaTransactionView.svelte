<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.KaspaTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.KaspaTransaction>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const kaspaTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'kaspa transaction'
	const viewDomId = $derived('kaspa-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
	import KaspaAcceptedTransactionsView from '$/views/KaspaAcceptedTransactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={kaspaTransaction}>
				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									transactionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionId = resolvedEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								{String((transactionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							subnetworkId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetworkId = resolvedEntity.subnetworkId}
					{#if subnetworkId !== undefined && subnetworkId !== null}
						<div>
							<dt>subnetwork ID</dt>
							<dd>
								{String((subnetworkId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							mass: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mass = resolvedEntity.mass}
					{#if mass !== undefined && mass !== null}
						<div>
							<dt>mass</dt>
							<dd>
								<NumberValue
									value={mass}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							payloadLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payloadLength = resolvedEntity.payloadLength}
					{#if payloadLength !== undefined && payloadLength !== null}
						<div>
							<dt>payload length</dt>
							<dd>
								{String((payloadLength) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>block hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									blockHashes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockHashes = resolvedEntity.blockHashes}
							{#if blockHashes !== undefined && blockHashes !== null}
								<TruncatedValue value={blockHashes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-kaspa-tx-io'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'kaspa-tx-inputs',
						label: 'Inputs',
						ownsSection: true,
					},
					{
						id: 'kaspa-tx-outputs',
						label: 'Outputs',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-io'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Inputs and outputs</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerKaspaTxInputs(_context, Content)}
				{@const kaspaTxIoKaspaTxInputsResource = selection.$$inputs}
				<ResourceBoundary
					resource={kaspaTxIoKaspaTxInputsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionKaspaTxInputs({ id, label, open, active })}
				{@const kaspaTxIoKaspaTxInputsResource = selection.$$inputs}
				<ResourceBoundary
					resource={kaspaTxIoKaspaTxInputsResource}
				>
					{#snippet children(utxoInput)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<UtxoInputsView
								selection={kaspaTxIoKaspaTxInputsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No UTXO inputs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerKaspaTxOutputs(_context, Content)}
				{@const kaspaTxIoKaspaTxOutputsResource = selection.$$outputs}
				<ResourceBoundary
					resource={kaspaTxIoKaspaTxOutputsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionKaspaTxOutputs({ id, label, open, active })}
				{@const kaspaTxIoKaspaTxOutputsResource = selection.$$outputs}
				<ResourceBoundary
					resource={kaspaTxIoKaspaTxOutputsResource}
				>
					{#snippet children(utxoOutput)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<UtxoOutputsView
								selection={kaspaTxIoKaspaTxOutputsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No UTXO outputs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-kaspa-tx-acceptance'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'kaspa-tx-acceptances',
						label: 'Acceptances',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-acceptance'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Acceptance</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerKaspaTxAcceptances(_context, Content)}
				{@const kaspaTxAcceptanceKaspaTxAcceptancesResource = selection.$$acceptances}
				<ResourceBoundary
					resource={kaspaTxAcceptanceKaspaTxAcceptancesResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionKaspaTxAcceptances({ id, label, open, active })}
				{@const kaspaTxAcceptanceKaspaTxAcceptancesResource = selection.$$acceptances}
				<ResourceBoundary
					resource={kaspaTxAcceptanceKaspaTxAcceptancesResource}
				>
					{#snippet children(kaspaAcceptedTransaction)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<KaspaAcceptedTransactionsView
								selection={kaspaTxAcceptanceKaspaTxAcceptancesResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No Kaspa acceptances.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
