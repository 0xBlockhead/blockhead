<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.CardanoDRep> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockfrost_Rest,
		],
	}))
	const cardanoDRep = $derived(viewSelection({
		fields: {
			displayName: true,
			credentialKind: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.displayName ?? ''), (pendingEntity.drepCredential ?? '')].filter(Boolean).join(' ') || 'Cardano DRep')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoGovernanceVotesView from '$/views/CardanoGovernanceVotesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoDRep}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				drepCredential: String(selection.entitySelector.drepCredential),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoDRep}>
			{#snippet children(entity)}
				{[(entity.displayName ?? ''), pendingEntity.drepCredential].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoDRep}>
			{#snippet children(entity)}
				{(entity.credentialKind ?? '') || [(entity.displayName ?? ''), pendingEntity.drepCredential].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoDRep}
			>
				{#snippet children(entity)}
					{@const displayName = entity.displayName}
					{#if displayName != null}
						<div>
							<dt>display name</dt>
							<dd>
								{displayName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>drep credential</dt>
				<dd>
					<TruncatedValue value={pendingEntity.drepCredential} />
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoDRep}
			>
				{#snippet children(entity)}
					{@const credentialKind = entity.credentialKind}
					{#if credentialKind != null}
						<div>
							<dt>credential kind</dt>
							<dd>
								<TruncatedValue value={credentialKind} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							anchorUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const anchorUrl = entity.anchorUrl}
					{#if anchorUrl != null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<a
									href={String(anchorUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(anchorUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							anchorHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const anchorHash = entity.anchorHash}
					{#if anchorHash != null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={anchorHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const cardanoDRepCardanoGovernanceVotesViewVotesResource = selection.$$votes}
		<ResourceBoundary
			resource={cardanoDRepCardanoGovernanceVotesViewVotesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CardanoGovernanceVotesView
						selection={cardanoDRepCardanoGovernanceVotesViewVotesResource}
						countResource={cardanoDRepCardanoGovernanceVotesViewVotesResource.count}
						title='votes'
						id='votes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
