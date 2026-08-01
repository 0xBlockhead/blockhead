<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.XNetwork> = $props()

	const xNetwork = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	})({
		fields: {
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
			registryName: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'X')
	const viewDomId = $derived('xnetwork-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.XNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.scope === 'XNetwork' ?
					resolve('/(social)/(x)/x')
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xNetwork}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		X
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={xNetwork}
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
				resource={xNetwork}
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
			<ResourceBoundary
				resource={xNetwork}
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
			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary
						resource={xNetwork}
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
				resource={xNetwork}
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

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-x-network-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'x-network-users',
						label: 'Users',
					},
					{
						id: 'x-network-posts',
						label: 'Posts',
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

			{#snippet SectionXNetworkUsers({ id, label, open })}
				<XUsersView
					selection={selection.$$xUsers}
					href={
						selection.entitySelector.scope === 'XNetwork' ?
							resolve('/(social)/(x)/x/(xNetwork)/users')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No X users here yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionXNetworkPosts({ id, label, open })}
				<XPostsView
					selection={selection.$$xPosts}
					href={
						selection.entitySelector.scope === 'XNetwork' ?
							resolve('/(social)/(x)/x/(xNetwork)/posts')
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No X posts here yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
