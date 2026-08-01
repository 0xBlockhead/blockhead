<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType._GlobalAtprotoNetwork> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const globalAtprotoNetwork = $derived(viewSelection({
		fields: {
			protocolName: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'AT Protocol')
	const viewDomId = $derived('-global-atproto-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAtprotoNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve('/(social)/(atproto)/atproto')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalAtprotoNetwork}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={globalAtprotoNetwork}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								relationshipModel: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const relationshipModel = entity.relationshipModel}
						{#if relationshipModel != null}
							<div>
								<dt>Connection model</dt>
								<dd>
									{relationshipModel}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Home</dt>
					<dd>
						<ResourceBoundary
							resource={
								viewSelection({
									fields: {
										homeUrl: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								<a
									href={entity.homeUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={entity.homeUrl} />
								</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								docsUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const docsUrl = entity.docsUrl}
						{#if docsUrl != null}
							<div>
								<dt>Documentation</dt>
								<dd>
									<a
										href={docsUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={docsUrl} />
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'accounts',
						label: 'Accounts',
					},
					{
						id: 'recent-posts',
						label: 'Recent posts',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Directory and examples</HeadingComponent>
					<Tooltip>
						{#snippet Content()}
							<p>
								Bounded observeds and example routes from declared AT Protocol appviews.
							</p>
						{/snippet}

						<abbr
							class="entity-heading-tip"
							aria-label='Directory and examples help'
						>ⓘ</abbr>
					</Tooltip>
				</header>
			{/snippet}

			{#snippet SectionAccounts({ id, label })}
				<AtprotoActorsView
					selection={selection.$$observedActors}
					href={resolve('/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actors')}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionRecentPosts({ id, label })}
				<AtprotoPostsView
					selection={selection.$$observedPosts}
					href={resolve('/(social)/(atproto)/atproto/(globalAtprotoNetwork)/posts')}
					collapsible={false}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
