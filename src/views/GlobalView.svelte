<script module lang="ts">
</script>


<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	type GlobalNavItem =
		| { key: 'self', label: string }
		| { key: string, label: string, path: string }


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		title,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet<[context?: {
				open?: boolean,
			}]>
			entityId: EntityId<typeof schema, EntityType._Global>
			title: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'title'
			| 'href'
			| 'open'
			| 'Details'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	const global = useEntity(
		EntityType._Global,
		entityId,
		{
			$: [
				Source.Local_Internal,
				...(
					open ?
						[Source.Dune_Rest]
					:
						[]
				),
			],
			...(open ?
				{
					duneCreditsUsed: {},
					duneCreditsIncluded: {},
				}
			:
				{}),
		},
	)


	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
</script>


<EntityView
	entityType={EntityType._Global}
	{entityId}
	{title}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Heading()}

		<span>
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		{#if !children}
			<section
				data-scroll-marker-label="Usage"
				id={`global:${entityId.scope}:usage`}
			>
				<ResourceBoundary
					resource={global}
					placeholderText="Loading usage…"
				>
					{#snippet children(global)}
						<dl data-column-item="center">
							{#if global.duneCreditsUsed !== undefined}
								<div>
									<dt>Query credits used</dt>
									<dd>{String(global.duneCreditsUsed)}</dd>
								</div>
							{/if}

							{#if global.duneCreditsIncluded !== undefined}
								<div>
									<dt>Query credits included</dt>
									<dd>{String(global.duneCreditsIncluded)}</dd>
								</div>
							{/if}

							{#if (
								global.duneCreditsUsed === undefined
								&& global.duneCreditsIncluded === undefined
							)}
								<div>
									<dt>Status</dt>
									<dd data-text="muted">
										No usage totals yet.
									</dd>
								</div>
							{/if}
						</dl>
					{/snippet}
				</ResourceBoundary>
			</section>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			<div
				class="entity-view-detail-carousels"
				data-column="gap-3"
			>
				{@render children({
					open: _open,
				})}
			</div>
		{:else}
			<EntityDetails
				entityType={EntityType._Global}
				{entityId}
			/>

			<div
				class="entity-view-detail-carousels"
				data-column="gap-3"
			>
				<CollapsibleTabs
					id={`global:${entityId.scope}:carousel-app`}
					{...{ 'data-card': '' }}
					scrollContainerProps={entityViewDetailCarouselScrollProps}
				>
					{#snippet Summary({
						open: _summaryOpen,
					})}
						<header
							data-row-item="flexible"
							data-row="wrap gap-4 align-center"
						>
							<HeadingComponent>
								App
							</HeadingComponent>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>
										Application menus often group shortcuts to L1/L2 networks, asset catalogs, name or identity systems, IPFS gateways, and common EVM explorers.
									</p>
									<p>
										Per-browser preference state is distinct from signing keys and from saved remote API endpoints.
									</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="About app navigation"
								>ⓘ</abbr>
							</Tooltip>
						</header>
					{/snippet}

					{#snippet Markers({
						open: _markersOpen,
					})}
						<a
							data-scroll-marker-label="Nav"
							href={`#global:${entityId.scope}:nav`}
						>Nav</a>
						<a
							data-scroll-marker-label="Usage"
							href={`#global:${entityId.scope}:usage`}
						>Usage</a>
					{/snippet}

					{#snippet body({ open: _paneOpen,
					})}
						<section
							id={`global:${entityId.scope}:nav`}
						>
							<UnorderedList
								items={
									new SvelteSet<GlobalNavItem>([
										{
											key: 'self',
											label: title,
										},
										{
											key: 'explore',
											label: 'Explore',
											path: '/explore',
										},
										...(
											href === resolve('/assets') ?
												[
													{
														key: 'assets-coins',
														label: 'Coins',
														path: '/coins',
													},
													{
														key: 'assets-pools',
														label: 'Pools',
														path: '/pools',
													},
												] as const
											:
												[]
										),
										...(
											href === resolve('/~/accounts') ?
												[
													{
														key: 'accounts-balances',
														label: 'Balances',
														path: '/~/accounts/balances',
													},
												] as const
											:
												[]
										),
									])
								}
								getKey={(row) => row.key}
								getSortValue={(row) => row.key}
								placeholderKeys={new SvelteSet()}
								orientation={ListOrientation.Column}
							>
								{#snippet Item({ item })}
									{#if item}
										{#if item.key === 'self'}
											<a href={resolve(href as `/${string}`)}>
												{item.label}
											</a>
										{:else}
											<a href={resolve(item.path)}>
												{item.label}
											</a>
										{/if}
									{/if}
								{/snippet}
							</UnorderedList>
						</section>

						<section
							id={`global:${entityId.scope}:usage`}
							data-scroll-marker-label="Usage"
						>
							<ResourceBoundary
								resource={global}
								placeholderText="Loading usage…"
							>
								{#snippet children(global)}
									<dl data-column-item="center">
										{#if global.duneCreditsUsed !== undefined}
											<div>
												<dt>Query credits used</dt>
												<dd>{String(global.duneCreditsUsed)}</dd>
											</div>
										{/if}

										{#if global.duneCreditsIncluded !== undefined}
											<div>
												<dt>Query credits included</dt>
												<dd>{String(global.duneCreditsIncluded)}</dd>
											</div>
										{/if}

										{#if (
											global.duneCreditsUsed === undefined
											&& global.duneCreditsIncluded === undefined
										)}
											<div>
												<dt>Status</dt>
												<dd data-text="muted">
													No usage totals yet.
												</dd>
											</div>
										{/if}
									</dl>
								{/snippet}
							</ResourceBoundary>
						</section>

					{/snippet}
				</CollapsibleTabs>
			</div>
		{/if}
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
