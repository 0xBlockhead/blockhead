<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { proposalCategoryById, specificationRealmById } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationProposal>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SpecificationProposal>>
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

	const selectedViewSources = $derived({
		'Bitcoin:Bip': [
			Source.BitcoinBips_Github,
		],
		'BitcoinCash:Chip': [
			Source.BitcoinCashChips_Gitlab,
		],
		'ChainAgnostic:Caip': [
			Source.Caips_Github,
		],
		'Cosmos:Adr': [
			Source.CosmosAdrs_Github,
		],
		'Dogecoin:Dip': [
			Source.DogecoinDips_Github,
		],
		'Ens:Ensip': [
			Source.Ensips_Github,
		],
		'Ethereum:Eip': [
			Source.EthereumEips_Github,
		],
		'Ethereum:Erc': [
			Source.EthereumEips_Github,
		],
		'Filecoin:Fip': [
			Source.FilecoinFips_Github,
		],
		'Hyperliquid:Hip': [
			Source.HyperliquidDocs_Rest,
		],
		'Litecoin:Lip': [
			Source.LitecoinLips_Github,
		],
		'Near:Nep': [
			Source.NearNeps_Github,
		],
		'Polkadot:Rfc': [
			Source.PolkadotRfcs_Github,
		],
		'Quilibrium:ProtocolDocument': [
			Source.QuilibriumDocs_Rest,
		],
		'Solana:Simd': [
			Source.SolanaSimds_Github,
		],
		'Zcash:Zip': [
			Source.ZcashZips_Github,
		],
	}[[String(selection.entitySelector.realm), String(selection.entitySelector.category)].join(':')] ?? [
		Source.BitcoinBips_Github,
		Source.BitcoinCashChips_Gitlab,
		Source.Caips_Github,
		Source.CosmosAdrs_Github,
		Source.DogecoinDips_Github,
		Source.Ensips_Github,
		Source.EthereumEips_Github,
		Source.FilecoinFips_Github,
		Source.HyperliquidDocs_Rest,
		Source.LitecoinLips_Github,
		Source.NearNeps_Github,
		Source.PolkadotRfcs_Github,
		Source.QuilibriumDocs_Rest,
		Source.SolanaSimds_Github,
		Source.ZcashZips_Github,
	])

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const specificationProposal = $derived(selection({
		sources: selectedViewSources,
		fields: {
			documentTitle: true,
			documentStatus: true,
		},
	}))
	const titleFallback = $derived([[
			[(String((proposalCategoryById[String(selection.entitySelector.category ?? prefetched.category)]?.label ?? (String((selection.entitySelector.category ?? prefetched.category) ?? ''))) ?? '') ? String((proposalCategoryById[String(selection.entitySelector.category ?? prefetched.category)]?.label ?? (String((selection.entitySelector.category ?? prefetched.category) ?? ''))) ?? '') + '-' : ''), String((selection.entitySelector.number ?? prefetched.number) ?? '')].filter(Boolean).join(''),
			String((prefetched.documentTitle) ?? ''),
		].filter(Boolean).join(': ')].filter(Boolean).join(' ') || [[
			[String((proposalCategoryById[String(selection.entitySelector.category ?? prefetched.category)]?.label ?? (String((selection.entitySelector.category ?? prefetched.category) ?? ''))) ?? '')].filter(Boolean).join(''),
			String((selection.entitySelector.number ?? prefetched.number) ?? ''),
		].filter(Boolean).join('-')].filter(Boolean).join(' ') || 'Specification proposal')
	const viewDomId = $derived('specification-proposal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.SpecificationProposal}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.realm !== undefined && pendingEntity.category !== undefined && pendingEntity.category !== undefined && pendingEntity.number !== undefined ? resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(proposalKind)/[proposalRef=proposalRef]', {
			specificationRealmSlug: String(specificationRealmById[String(pendingEntity.realm)].slug ?? ''),
			proposalKindSlug: String(proposalCategoryById[String(pendingEntity.category)].slug ?? ''),
			proposalRef: `${String(String(proposalCategoryById[String(pendingEntity.category)].slug ?? '') ?? '')}-${String(pendingEntity.number ?? '')}`,
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.SummaryInline}
			{`${String(proposalCategoryById[String(selection.entitySelector.category)].label ?? selection.entitySelector.category ?? '')}-${String(selection.entitySelector.number ?? '')}`}
		{:else}
			<ResourceBoundary resource={specificationProposal}>
				{#snippet children(entity)}
					{@const proposalIdentifier = `${String(entity.categoryLabel ?? proposalCategoryById[String(selection.entitySelector.category)].label ?? selection.entitySelector.category ?? '')}-${String(selection.entitySelector.number ?? '')}`}
					{@const documentTitle = String(entity.documentTitle ?? '').trim()}
					{@const documentBodyHeading = String(selection.entitySelector.category) === 'Ensip' ? (String(entity.documentBody ?? '').match(/#\s*(ENSIP-\d+:\s*.+)/)?.[1] ?? '').trim() : ''}
					{@const heading = documentTitle !== '' ? documentTitle : documentBodyHeading}
					{#if heading === ''}
						{proposalIdentifier}
					{:else if heading.toLowerCase().startsWith(`${proposalIdentifier.toLowerCase()}:`)}
						{heading}
					{:else}
						{`${proposalIdentifier}: ${heading}`}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={specificationProposal}>
			{#snippet children(entity)}
				<span>
					{`${String(entity.categoryLabel ?? proposalCategoryById[String(selection.entitySelector.category)].label ?? selection.entitySelector.category ?? '')}-${String(selection.entitySelector.number ?? '')}`}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Each entry is a numbered specification pulled from upstream documentation trees, grouped first by stewarding realm, then by document family.
		</p>

		<p>
			Catalog entries capture stewarded specification text and lifecycle status; live vote weights and treasury execution are tracked in governance systems on-chain or in forums.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							documentCategory: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const documentCategory = prefetched.documentCategory}
					{#if documentCategory !== undefined && documentCategory !== null}
						<div>
							<dt>Category</dt>
							<dd>
								{String((documentCategory) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentCategory = resolvedEntity.documentCategory}
					{#if documentCategory !== undefined && documentCategory !== null}
						<div>
							<dt>Category</dt>
							<dd>
								{String((documentCategory) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							documentStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const documentStatus = prefetched.documentStatus}
					{#if documentStatus !== undefined && documentStatus !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((documentStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentStatus = resolvedEntity.documentStatus}
					{#if documentStatus !== undefined && documentStatus !== null}
						<div>
							<dt>Status</dt>
							<dd>
								{String((documentStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<div>
					<dt>Realm</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection({
									fields: {
										realm: true,
									},
								})
							}
						>
							{#snippet Pending()}
								{@const realm = selection.entitySelector.realm ?? prefetched.realm}
								{#if realm !== undefined && realm !== null}
									<a
										href={
											resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
												specificationRealmSlug: String(specificationRealmById[String(({ value: realm, ...pendingEntity }).value)].slug ?? ''),
											})
										}
									>
										{String((specificationRealmById[String(realm)]?.label ?? (String((realm) ?? ''))) ?? '')}
									</a>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const realm = resolvedEntity.realm}
								{#if realm !== undefined && realm !== null}
									<a
										href={
											resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', {
												specificationRealmSlug: String(specificationRealmById[String(({ value: realm, ...resolvedEntity }).value)].slug ?? ''),
											})
										}
									>
										{String((specificationRealmById[String(realm)]?.label ?? (String((realm) ?? ''))) ?? '')}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Kind</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection({
									fields: {
										category: true,
									},
								})
							}
						>
							{#snippet Pending()}
								{@const category = selection.entitySelector.category ?? prefetched.category}
								{#if category !== undefined && category !== null}
									<a
										href={
											resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
												specificationRealmSlug: String(specificationRealmById[String(({ value: category, ...pendingEntity }).realm)].slug ?? ''),
												proposalKindSlug: String(proposalCategoryById[String(({ value: category, ...pendingEntity }).category)].slug ?? ''),
											})
										}
									>
										{String((proposalCategoryById[String(category)]?.label ?? (String((category) ?? ''))) ?? '')}
									</a>
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const category = resolvedEntity.category}
								{#if category !== undefined && category !== null}
									<a
										href={
											resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
												specificationRealmSlug: String(specificationRealmById[String(({ value: category, ...resolvedEntity }).realm)].slug ?? ''),
												proposalKindSlug: String(proposalCategoryById[String(({ value: category, ...resolvedEntity }).category)].slug ?? ''),
											})
										}
									>
										{String((proposalCategoryById[String(category)]?.label ?? (String((category) ?? ''))) ?? '')}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>

		<section
			id={viewDomId + '-body'}
			data-scroll-marker-label='Document body'
		>
			<h3>Document body</h3>
			<ResourceBoundary
				resource={
					selection({
						fields: {
							documentBody: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentBody = resolvedEntity.documentBody}
					{#if documentBody !== undefined && documentBody !== null && documentBody !== ''}
						<Markdown content={String(documentBody)} />
					{:else}
						<p data-text="muted">No proposal body available.</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</section>
	{/snippet}
</EntityView>
