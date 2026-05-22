<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		title = 'Manage',
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType._Global>
			title?: string
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


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


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
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
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Heading()}
		<span>
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Browser storage can keep UI preferences and optional third-party API usage counters tied to one profile.
		</p>
		<p>
			RPC or indexer base URLs and API keys belong in transport configuration rows, not in generic preference blobs.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open: summaryOpen })}
		{#if summaryOpen}
		<dl data-column-item="center">
			<ResourceBoundary resource={global}>
				{#snippet children(global)}
					{#if global.duneCreditsUsed !== undefined}
						<div>
							<dt>Dune credits used</dt>
							<dd>{String(global.duneCreditsUsed)}</dd>
						</div>
					{/if}

					{#if global.duneCreditsIncluded !== undefined}
						<div>
							<dt>Dune credits included</dt>
							<dd>{String(global.duneCreditsIncluded)}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
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
					id={`setting:${entityId.scope}:carousel-manage`}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({
						open: _summaryOpen,
					})}
						<header
							data-row-item="flexible"
							data-row="wrap gap-4 align-center"
						>
							<HeadingComponent>
								Manage
							</HeadingComponent>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
								<p>
									Per-profile preferences and API credit counters are ordinary web storage concerns—separate artifacts from seed phrases or hardware keys.
								</p>
								<p>
									RPC, REST, and GraphQL transport bases stay in their own configuration records so URLs, headers, and keys are not collapsed into generic key-value settings blobs.
								</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="Manage sections"
								>ⓘ</abbr>
							</Tooltip>
						</header>
					{/snippet}

					{#snippet Markers({
						open: _markersOpen,
					})}
						<a
							data-scroll-marker-label="Navigation"
							href={`#setting:${entityId.scope}:nav`}
						>Navigation</a>
						<a
							data-scroll-marker-label="Usage"
							href={`#setting:${entityId.scope}:usage`}
						>Usage</a>
					{/snippet}

					{#snippet body({ open: _paneOpen,
					})}
						<section
							id={`setting:${entityId.scope}:nav`}
						>
							<UnorderedList
								items={new SvelteSet([
									{
										key: 'self',
										href,
										label: title,
									},
									{
										key: 'explore',
										href: resolve('/explore'),
										label: 'Explore',
									},
									...(
										href === resolve('/assets') ?
											[
												{
													key: 'assets-coins',
													href: resolve('/coins'),
													label: 'Coins',
												},
												{
													key: 'assets-pools',
													href: resolve('/pools'),
													label: 'Pools',
												},
											]
										:
											[]
									),
									...(
										href === resolve('/~/accounts') ?
											[
												{
													key: 'accounts-balances',
													href: resolve('/~/accounts/balances'),
													label: 'Balances',
												},
											]
										:
											[]
									),
								])}
								getKey={(row) => row.key}
								getSortValue={(row) => row.key}
								placeholderKeys={new SvelteSet()}
								orientation={ListOrientation.Column}
							>
								{#snippet Item({
									item,
								})}
									<a href={item.href}>
										{item.label}
									</a>
								{/snippet}
							</UnorderedList>
						</section>

						<section
							id={`setting:${entityId.scope}:usage`}
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
												<dt>Dune credits used</dt>
												<dd>{String(global.duneCreditsUsed)}</dd>
											</div>
										{/if}

										{#if global.duneCreditsIncluded !== undefined}
											<div>
												<dt>Dune credits included</dt>
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
													No usage totals global yet.
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
