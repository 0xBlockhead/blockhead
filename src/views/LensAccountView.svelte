<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { default as EntityViewComponent } from '$/components/EntityView.svelte'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.LensAccount>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityViewComponent>,
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
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const lensAccount = useEntity(
		EntityType.LensAccount,
		entityId,
		{
			$: [Source.Lens_Graphql],
			localName: {},
		},
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
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
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary resource={lensAccount}>
			{#snippet children(resolvedLensAccount)}
				{#if resolvedLensAccount.localName}
					{resolvedLensAccount.localName}
				{:else}
					{entityId.address}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.address}
		</span>
	{/snippet}



	{#snippet Icon()}
		<IconComponent
			shape={IconShape.Circle}
			icon="L"
			label="Lens"
		/>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column>
			<ResourceBoundary resource={lensAccount}>
				{#snippet children(resolvedLensAccount)}
					<dl data-column-item="center">
						{#if resolvedLensAccount.localName}
							<div>
								<dt>Address</dt>
								<dd data-text="mono">
									{@render Id()}
								</dd>
							</div>
						{/if}
						{#if resolvedLensAccount.localName !== undefined}
							<div>
								<dt>Handle</dt>
								<dd>{resolvedLensAccount.localName}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.LensAccount}
			{entityId}
		/>

		<Collapsible
			id={`${idKey}:carousel-activity`}
			{...{ 'data-card': '' }}
		>
			{#snippet Summary({
				open: _summaryOpen,
			})}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Activity
					</HeadingComponent>
				</header>
			{/snippet}
			{#snippet children(_ctx)}
				<div
					class="carousel"
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
				>
					<section data-scroll-marker-label="Posts">
						<LensPostsView
							entityFieldReference={{
								entityType: EntityType.LensAccount,
								entityId,
								fieldName: '$$posts',
							}}
							href={resolve('/(social)/lens/account/[address]/(account)/posts', {
								address: entityId.address,
							})}
							id={`${idKey}:posts`}
							open={false}
						/>
					</section>
				</div>
			{/snippet}
		</Collapsible>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.carousel {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
