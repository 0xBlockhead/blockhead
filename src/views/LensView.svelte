<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(lens)/lens'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LensNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	const networkSelectorKey = $derived(
		stringify(selection.entitySelector)
	)

	const lensNetwork = $derived(selection( { sources: [Source.Constants_Internal], fields: { protocolName: true, registryLabel: true, ...(open ? ({ homeUrl: true, docsUrl: true, topology: true, $$lensAccounts: ({ sources: [
							Source.Constants_Internal,
							Source.Lens_Graphql,
						] }), $$lensPosts: ({ sources: [
							Source.Lens_Graphql,
						] }) }) : ({  })) } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.LensNetwork}
	entitySelector={selection.entitySelector}
	href={href}
	layout={EntityLayout.SummaryDetails}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Lens"
>
	{#snippet Value()}
		Lens
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={lensNetwork}
			placeholderText="Loading Lens…"
		>
			{#snippet children(lensNetwork)}
				{lensNetwork.protocolName ?? 'Lens'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens v3 separates publisher profiles (addresses and account metadata) from publications surfaced here as posts and reposts.
		</p>
		<p>
			Counts here reflect the Graph-backed slice wired for this app; they index protocol activity the resolver exposes, not an exhaustive offline mirror of Lens.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensNetwork}
				placeholderText="Loading Lens…"
			>
				{#snippet children(lensNetwork)}
					{#if lensNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{lensNetwork.registryLabel}</dd>
						</div>
					{:else if lensNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{lensNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if contentOpen}
						<div>
							<dt>Profiles</dt>
							<dd>{String(lensNetwork.$$lensAccounts?.values.length ?? 0)}</dd>
						</div>
						<div>
							<dt>Publications</dt>
							<dd>{String(lensNetwork.$$lensPosts?.values.length ?? 0)}</dd>
						</div>

						{#if lensNetwork.topology}
							<div>
								<dt>Topology</dt>
								<dd>{lensNetwork.topology}</dd>
							</div>
						{/if}

						{#if lensNetwork.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={lensNetwork.homeUrl}>{lensNetwork.homeUrl}</a>
								</dd>
							</div>
						{/if}

						{#if lensNetwork.docsUrl !== undefined}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={lensNetwork.docsUrl}>
										{lensNetwork.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-registry`}
			sectionIdPrefix={networkSelectorKey}
			sections={collapsibleTabsSections([
				{ id: 'registry-accounts', label: 'Profiles' },
				{ id: 'registry-posts', label: 'Publications' },
				{ id: 'examples-lensNetworks', label: 'Examples' },
			])}
			data-card
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Directory & examples
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRegistryAccounts()}
				<LensAccountsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/lens/accounts')}
					selection={selection.$$lensAccounts}
					id={`${networkSelectorKey}:accounts`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionRegistryPosts()}
				<LensPostsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/lens/posts')}
					selection={selection.$$lensPosts}
					id={`${networkSelectorKey}:posts`}
					open={_open}
					title="Recent Lens v3 publications"
				/>
			{/snippet}

			{#snippet SectionExamplesList()}
				<ul>
					<li>
						<a href={resolve('/(social)/(lens)/lens/account/[address=evmAddress]', {
							address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
						})}>
							Lens v3 profile example
						</a>
					</li>
					<li>
						<a href={resolve('/(social)/(lens)/lens/posts')}>
							Browse recent publications
						</a>
					</li>
				</ul>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
