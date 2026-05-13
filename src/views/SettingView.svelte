<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Manage',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType._Global>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
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
				Source.Dune_Rest,
			],
			duneCreditsUsed: {},
			duneCreditsIncluded: {},
		},
	)
</script>


<EntityView
	entityType={EntityType._Global}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType._Global}
				{entityId}
			>
				<ResourceBoundary resource={global}>
					{#snippet children(g)}
						<p data-text="muted">
							Shared app settings and usage totals.
						</p>
						<dl>
							{#if g.duneCreditsUsed !== undefined}
								<div>
									<dt>Dune credits used</dt>
									<dd>{String(g.duneCreditsUsed)}</dd>
								</div>
							{/if}
							{#if g.duneCreditsIncluded !== undefined}
								<div>
									<dt>Dune credits included</dt>
									<dd>{String(g.duneCreditsIncluded)}</dd>
								</div>
							{/if}
						</dl>

						{#if g.duneCreditsUsed === undefined && g.duneCreditsIncluded === undefined}
							<p data-text="muted">
								Usage totals are not available yet.
							</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>

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
				{#snippet Item({ item })}
					<a href={item.href}>
						{item.label}
					</a>
				{/snippet}
			</UnorderedList>
		{/if}
	{/snippet}
</EntityView>
