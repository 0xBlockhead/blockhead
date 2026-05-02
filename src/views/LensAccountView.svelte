<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import { mergeEntityCollectionRowFields } from '$/collections/mergeEntityCollectionRowFields.ts'
	import type { default as EntityViewComponent } from '$/components/EntityView.svelte'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
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
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const idKey = $derived(stringify(entityId))

	const lensAccountMergeSourceOrder = [
		Source.Lens_Graphql,
	] as const

	const rowQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.LensAccount] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						idKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => idKey],
	)

	const lensFields = $derived(
		mergeEntityCollectionRowFields(
			EntityType.LensAccount,
			rowQuery.data,
			lensAccountMergeSourceOrder,
		),
	)

	const displayTitle = $derived(
		lensFields.localName?.length ?
			lensFields.localName
		:
			entityId.address,
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccount}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Icon()}
		<Icon
			shape={IconShape.Circle}
			icon="L"
			label="Lens"
		/>
	{/snippet}

	{#snippet Content()}
		<div data-text="mono muted">
			{entityId.address}
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.LensAccount}
			{entityId}
		>
			<QueryBoundary
				query={rowQuery}
			>
				{#snippet children(rows)}
					{#if rows == null || rows.length === 0}
						<p data-text="muted">
							No Lens account data in the app for this address yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Address</dt>
								<dd>
									<span data-text="mono">
										{entityId.address}
									</span>
								</dd>
							</div>
							{#if lensFields.localName !== undefined && lensFields.localName.length > 0}
								<div>
									<dt>Handle</dt>
									<dd>{lensFields.localName}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<Collapsible
			id={`${idKey}:carousel-activity`}
			{...{ 'data-card': '' }}
		>
			{#snippet Summary({
				open: _open,
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
					<section>
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
