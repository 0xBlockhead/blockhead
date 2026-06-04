<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type GlobalNavItem = {
		key: string
		label: string
		path: string
	}


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'
	import type { ResolvedPathname } from '$app/types'


	// State
	let {
		children,
		entityId,
		title,
		href,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			children?: Snippet<[context: {
				open?: boolean,
			}]>
			entityId: EntityId<typeof schema, EntityType._Global>
			title: string
			/** href override: hub pages (`/assets`, `/explore`, `/social`, …) each pass their canonical URL. */
			href: ResolvedPathname
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

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
	{...EntityViewProps}
>
	{#snippet Value()}
		{entityId.scope}
	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet Content({})}
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
			{@render children({
				open: _open,
			})}
		{:else}
			<CollapsibleTabs
				id={`global:${entityId.scope}:carousel-app`}
				sectionIdPrefix={`global:${entityId.scope}`}
				sections={[
					{ id: 'nav', label: 'Nav' },
					{ id: 'usage', label: 'Usage' },
				]}
				data-card
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

				{#snippet SectionNav({ id, label })}
					<UnorderedList
						items={
							new SvelteSet<GlobalNavItem>([
								{
									key: 'self',
									label: title,
									path: href,
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
						getKey={(global) => global.key}
						getSortValue={(global) => global.key}
						orientation={ListOrientation.Column}
					>
						{#snippet Item({ item })}
							<a href={item.path}>
									{item.label}
								</a>
						{/snippet}
					</UnorderedList>
				{/snippet}

				{#snippet SectionUsage({ id, label })}
					<ResourceBoundary
						resource={global}
						placeholderText="Loading usage…"
					>
						{#snippet children(global)}
							<div>
								{#if global.duneCreditsUsed !== undefined}
									<p><strong>Query credits used:</strong> {String(global.duneCreditsUsed)}</p>
								{/if}

								{#if global.duneCreditsIncluded !== undefined}
									<p><strong>Query credits included:</strong> {String(global.duneCreditsIncluded)}</p>
								{/if}

								{#if (
									global.duneCreditsUsed === undefined
									&& global.duneCreditsIncluded === undefined
								)}
									<p data-text="muted">
										No usage totals yet.
									</p>
								{/if}
							</div>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
		</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
