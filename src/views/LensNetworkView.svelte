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
	}: EntitySelectionViewProps<EntityType.LensNetwork> = $props()

	const lensNetwork = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	})({
		fields: {
			protocolName: true,
			relationshipModel: true,
			homeUrl: true,
			docsUrl: true,
			registryName: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'Lens')
	const viewDomId = $derived('lens-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.LensNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve('/(social)/(lens)/lens')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensNetwork}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		Lens
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={lensNetwork}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensNetwork}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensNetwork}
			>
				{#snippet children(entity)}
					{@const registryName = entity.registryName}
					{#if registryName != null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{registryName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary
						resource={lensNetwork}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensNetwork}
			>
				{#snippet children(entity)}
					{@const docsUrl = entity.docsUrl}
					{#if docsUrl != null}
						<div>
							<dt>Docs URL</dt>
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
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-lens-network-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'lens-network-accounts',
						label: 'Accounts',
					},
				]
			}
			data-card
			class='network-view-collapsible-directory'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Directory</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLensNetworkAccounts({ id, label })}
				<LensAccountsView
					selection={selection.$$lensAccounts}
					href={resolve('/(social)/(lens)/lens/(lensNetwork)/observations/accounts')}
					collapsible={false}
					title={label}
					emptyText='No Lens accounts in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-lens-network-posts'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'lens-network-post-list',
						label: 'Posts',
					},
				]
			}
			data-card
			class='network-view-collapsible-posts'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Posts</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLensNetworkPostList({ id, label })}
				<LensPostsView
					selection={selection.$$lensPosts}
					href={resolve('/(social)/(lens)/lens/(lensNetwork)/observations/posts')}
					collapsible={false}
					title={label}
					emptyText='No Lens posts in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
