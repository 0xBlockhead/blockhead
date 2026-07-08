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
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalNostrNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalNostrNetwork>>
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
	const globalNostrNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			registryName: true,
			homeUrl: true,
			docsUrl: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived(['Nostr'].filter(Boolean).join(' ') || 'Nostr')
	const viewDomId = $derived('-global-nostr-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrRelaysView from '$/views/NostrRelaysView.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
	import GlobalNostrNetwork_TimestampsView from '$/views/_GlobalNostrNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalNostrNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalNostrNetwork}>
			{#snippet Pending()}
				{['Nostr'].filter(Boolean).join(' ') || title || 'Nostr'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{['Nostr'].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Nostr is a relay-based social protocol for signed events. Profiles, notes, reposts, and articles are event kinds; relays are transport endpoints and are not global proof that an event exists everywhere.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Constants_Internal,
						],
						fields: {
							registryName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registryName = prefetched.registryName}
					{#if registryName !== undefined && registryName !== null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{String((registryName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registryName = resolvedEntity.registryName}
					{#if registryName !== undefined && registryName !== null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{String((registryName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Constants_Internal,
						],
						fields: {
							protocolName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const protocolName = prefetched.protocolName}
					{#if protocolName !== undefined && protocolName !== null}
						<div>
							<dt>Protocol</dt>
							<dd>
								{String((protocolName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolName = resolvedEntity.protocolName}
					{#if protocolName !== undefined && protocolName !== null}
						<div>
							<dt>Protocol</dt>
							<dd>
								{String((protocolName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.Constants_Internal,
							],
							fields: {
								homeUrl: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const homeUrl = prefetched.homeUrl}
						{#if homeUrl !== undefined && homeUrl !== null}
							<div>
								<dt>Home</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(homeUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(homeUrl)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const homeUrl = resolvedEntity.homeUrl}
						{#if homeUrl !== undefined && homeUrl !== null}
							<div>
								<dt>Home</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(homeUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(homeUrl)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.Constants_Internal,
							],
							fields: {
								docsUrl: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const docsUrl = prefetched.docsUrl}
						{#if docsUrl !== undefined && docsUrl !== null}
							<div>
								<dt>NIPs</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(docsUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(docsUrl)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const docsUrl = resolvedEntity.docsUrl}
						{#if docsUrl !== undefined && docsUrl !== null}
							<div>
								<dt>NIPs</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(docsUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(docsUrl)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.Constants_Internal,
							],
							fields: {
								relationshipModel: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const relationshipModel = prefetched.relationshipModel}
						{#if relationshipModel !== undefined && relationshipModel !== null}
							<div>
								<dt>Connection model</dt>
								<dd>
									<span data-text="long-text">{String((relationshipModel) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const relationshipModel = resolvedEntity.relationshipModel}
						{#if relationshipModel !== undefined && relationshipModel !== null}
							<div>
								<dt>Connection model</dt>
								<dd>
									<span data-text="long-text">{String((relationshipModel) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NostrProfilesView
				selection={
						selection.$$observedProfiles({
							sources: [
								Source.NostrBand_Rest,
							],
						})
					}
				title='Profiles'
				href={resolve('/(social)/(nostr)/nostr/profiles')}
				emptyText='No Nostr profiles in this observed.'
				id='NostrProfilesView-observed-profiles'
			/>

			<NostrNotesView
				selection={
						selection.$$observedNotes({
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
						})
					}
				title='Notes'
				href={resolve('/(social)/(nostr)/nostr/notes')}
				emptyText='No Nostr notes in this observed.'
				id='NostrNotesView-observed-notes'
			/>

			<NostrRelaysView
				selection={
						selection.$$observedRelays({
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
						})
					}
				title='Relays'
				href={resolve('/(social)/(nostr)/nostr/relays')}
				emptyText='No Nostr relays in this observed.'
				id='NostrRelaysView-observed-relays'
			/>

			<NostrArticlesView
				selection={
						selection.$$observedArticles({
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
						})
					}
				title='Articles'
				href={resolve('/(social)/(nostr)/nostr/articles')}
				emptyText='No Nostr articles in this observed.'
				id='NostrArticlesView-observed-articles'
			/>

			<NostrRepostsView
				selection={
						selection.$$observedReposts({
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
						})
					}
				title='Reposts'
				href={resolve('/(social)/(nostr)/nostr/reposts')}
				emptyText='No Nostr reposts in this observed.'
				id='NostrRepostsView-observed-reposts'
			/>

			<NostrReactionsView
				selection={selection.$$observedReactions}
				title='Reactions'
				href={resolve('/(social)/(nostr)/nostr/reactions')}
				emptyText='No Nostr reactions in this observed.'
				id='NostrReactionsView-observed-reactions'
			/>

			<GlobalNostrNetwork_TimestampsView
				selection={selection.$$timestamps}
				title='Observations'
				emptyText='No Nostr network observations.'
				id='_GlobalNostrNetwork_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
