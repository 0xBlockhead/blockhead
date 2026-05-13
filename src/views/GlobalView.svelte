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


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'


	// Props
	let {
		children,
		entityId,
		title,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
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
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	const duneUsage = useEntity(
		EntityType._Global,
		{},
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
				<p data-text="muted">
					Shared app settings and usage totals.
				</p>

				<ResourceBoundary resource={duneUsage}>
					{#snippet children(global)}
						<dl>
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
						</dl>

						{#if global.duneCreditsUsed === undefined && global.duneCreditsIncluded === undefined}
							<p data-text="muted">
								Usage totals are not available yet.
							</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>

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
				{#snippet Item({ item, isPlaceholder })}
					{#if isPlaceholder === false}
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
		{/if}
	{/snippet}
</EntityView>
