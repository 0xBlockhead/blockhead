<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.CardanoDRep>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.CardanoDRep>>
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
	const cardanoDRep = $derived(selection({
		sources: selection.sources,
		fields: {
			credentialKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.drepCredential) ?? '')].filter(Boolean).join(' ') || 'Cardano DRep')
	const viewDomId = $derived('cardano-drep-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoGovernanceVotesView from '$/views/CardanoGovernanceVotesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoDRep}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.drepCredential !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
			drepCredential: String(pendingEntity.drepCredential ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.drepCredential !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/drep/[drepCredential=stringSegment]', {
			drepCredential: String(pendingEntity.drepCredential ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.drepCredential) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoDRep}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.drepCredential) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.credentialKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.drepCredential) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoDRep}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.credentialKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.drepCredential) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>drep credential</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									drepCredential: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const drepCredential = resolvedEntity.drepCredential}
							{#if drepCredential !== undefined && drepCredential !== null}
								<TruncatedValue value={String((drepCredential) ?? '')} />
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
							credentialKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const credentialKind = resolvedEntity.credentialKind}
					{#if credentialKind !== undefined && credentialKind !== null}
						<div>
							<dt>credential kind</dt>
							<dd>
								<TruncatedValue value={String((credentialKind) ?? '')} />
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
							anchorUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const anchorUrl = resolvedEntity.anchorUrl}
					{#if anchorUrl !== undefined && anchorUrl !== null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(anchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(anchorUrl)} />
								</svelte:element>
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
							anchorHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const anchorHash = resolvedEntity.anchorHash}
					{#if anchorHash !== undefined && anchorHash !== null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={String((anchorHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CardanoGovernanceVotesView
				selection={
						selection.$$votes({
							sources: [
								Source.Blockfrost_Rest,
							],
							count: true,
						})
					}
				title='votes'
				emptyText='No votes.'
				id='CardanoGovernanceVotesView-votes'
			/>
		{/if}
	{/snippet}
</EntityView>
