<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

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

	const network = $derived(selection.entitySelector.$network)
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
	const titleFallback = $derived([(prefetched.displayName ?? ''), selection.entitySelector.drepCredential].filter(Boolean).join(' ') || 'Cardano DRep')


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
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					drepCredential: selection.entitySelector.drepCredential,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoDRep}>
			{#snippet children(entity)}
				{[(entity.displayName ?? ''), selection.entitySelector.drepCredential].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoDRep}>
			{#snippet children(entity)}
				{(entity.credentialKind ?? '') || [(entity.displayName ?? ''), selection.entitySelector.drepCredential].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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
					<TruncatedValue value={selection.entitySelector.drepCredential} />
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
								{credentialKind}
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
									href={anchorUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={anchorUrl} />
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

	{#snippet Details()}
		{@const votesResource = selection.$$votes}
		<ResourceBoundary
			resource={votesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CardanoGovernanceVotesView
						selection={votesResource}
						countResource={votesResource.count}
						title='votes'
						id='votes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
