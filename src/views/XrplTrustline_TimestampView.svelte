<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.XrplTrustline_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.XrplTrustline_Timestamp>
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
	const xrplTrustlineTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'XRPL trustline timestamp'
	const viewDomId = $derived('xrpl-trustline-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XrplTrustlineView from '$/views/XrplTrustlineView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplTrustline_Timestamp}
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
			<ResourceBoundary resource={xrplTrustlineTimestamp}>
				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>trustline</dt>
				<dd>
					<XrplTrustlineView
						selection={select(EntityType.XrplTrustline, selection.entitySelector.$trustline)}
						href={
							(
								selection.entitySelector.$trustline != null && 'account' in selection.entitySelector.$trustline
								&& selection.entitySelector.$trustline.account != null
								&& selection.entitySelector.$trustline != null && 'currency' in selection.entitySelector.$trustline
								&& selection.entitySelector.$trustline.currency != null
								&& selection.entitySelector.$trustline != null && 'issuer' in selection.entitySelector.$trustline
								&& selection.entitySelector.$trustline.issuer != null
								&& selection.entitySelector.$trustline != null && '$network' in selection.entitySelector.$trustline ?
									selection.entitySelector.$trustline.$network != null && 'caip2' in selection.entitySelector.$trustline.$network
									&& selection.entitySelector.$trustline.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
									account: String(selection.entitySelector.$trustline.account ?? ''),
									currency: String(selection.entitySelector.$trustline.currency ?? ''),
									issuer: String(selection.entitySelector.$trustline.issuer ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$trustline.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$trustline.$network != null && 'slug' in selection.entitySelector.$trustline.$network
										&& selection.entitySelector.$trustline.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
										account: String(selection.entitySelector.$trustline.account ?? ''),
										currency: String(selection.entitySelector.$trustline.currency ?? ''),
										issuer: String(selection.entitySelector.$trustline.issuer ?? ''),
										network: String(selection.entitySelector.$trustline.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									ledgerIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerIndex = resolvedEntity.ledgerIndex}
							{#if ledgerIndex !== undefined && ledgerIndex !== null}
								{String((ledgerIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
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
							balance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balance = resolvedEntity.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								{String((balance) ?? '')}
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
							limit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const limit = resolvedEntity.limit}
					{#if limit !== undefined && limit !== null}
						<div>
							<dt>limit</dt>
							<dd>
								{String((limit) ?? '')}
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
							limitPeer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const limitPeer = resolvedEntity.limitPeer}
					{#if limitPeer !== undefined && limitPeer !== null}
						<div>
							<dt>limit peer</dt>
							<dd>
								{String((limitPeer) ?? '')}
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
							noRipple: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const noRipple = resolvedEntity.noRipple}
					{#if noRipple !== undefined && noRipple !== null}
						<div>
							<dt>no ripple</dt>
							<dd>
								{noRipple ? 'Yes' : 'No'}
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
							noRipplePeer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const noRipplePeer = resolvedEntity.noRipplePeer}
					{#if noRipplePeer !== undefined && noRipplePeer !== null}
						<div>
							<dt>no ripple peer</dt>
							<dd>
								{noRipplePeer ? 'Yes' : 'No'}
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
							authorized: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorized = resolvedEntity.authorized}
					{#if authorized !== undefined && authorized !== null}
						<div>
							<dt>authorized</dt>
							<dd>
								{authorized ? 'Yes' : 'No'}
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
							peerAuthorized: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerAuthorized = resolvedEntity.peerAuthorized}
					{#if peerAuthorized !== undefined && peerAuthorized !== null}
						<div>
							<dt>peer authorized</dt>
							<dd>
								{peerAuthorized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
