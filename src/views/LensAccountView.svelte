<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children: _children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.LensAccount>
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
			| 'Icon'
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const lensAccount = useEntity(
		EntityType.LensAccount,
		entityId,
		(
			open ?
				{
					$: [Source.Lens_Graphql],
					localName: {},
				}
			:
				{}
		),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccount}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Heading()}
		<ResourceBoundary resource={lensAccount}>
			{#snippet children(lensAccount)}
				{#if lensAccount.localName}
					{lensAccount.localName}
				{:else}
					{entityId.address}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.address}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Icon()}
		<IconComponent
			shape={IconShape.Circle}
			icon="L"
			label="Lens"
		/>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Profile address</dt>
				<dd data-text="mono">
					<ResourceBoundary resource={lensAccount}>
						{#snippet children(lensAccount)}
							{#if lensAccount.localName}
								{@render Title()}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-activity`}
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
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Lens v3 profile &amp; publications
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Record"
						href={`#${idKey}:lens-account-record`}
					>Record</a>
					<a
						data-scroll-marker-label="Publications"
						href={`#${idKey}:posts`}
					>Publications (Lens v3)</a>
				{/snippet}

				{#snippet body(_ctx)}
					<section
						data-scroll-marker-label="Record"
						id={`${idKey}:lens-account-record`}
					>
						<EntityDetails
							entityType={EntityType.LensAccount}
							{entityId}
						/>
					</section>
					<section
						data-scroll-marker-label="Publications"
						id={`${idKey}:posts`}
					>
						<LensPostsView
							entityFieldReference={{
								entityType: EntityType.LensAccount,
								entityId,
								fieldName: '$$posts',
							}}
							href={resolve('/(social)/lens/account/[address]/(account)/posts', {
								address: entityId.address,
							})}
							id={`${idKey}:posts-list`}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if _children}
			{@render _children()}
		{/if}
	{/snippet}
</EntityView>

