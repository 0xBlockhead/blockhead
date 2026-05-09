<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'

	const entityId = {
		scope: 'LensNetwork' as const,
	}

	const exampleAccountAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as const
	const examplePostId = 'replace-with-lens-post-id-or-slug' as const


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'

	const networkIdKey = stringify(entityId)

	const networkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.LensNetwork] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const accountsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.LensNetwork]['$$lensAccounts'] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const postsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.LensNetwork]['$$lensPosts'] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const networkFields = $derived.by(() => {
		const bag = networkQuery.data?.[0]?.row?.[EntityMetaKey.Fields]
		return bag != null && (typeof bag === 'object' && bag !== null && !Array.isArray(bag)) ? bag : null
	})


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import LensAccountsView from '$/views/LensAccountsView.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.LensNetwork}
	{entityId}
	href={resolve('/(social)/lens')}
	open={true}
	title="Lens"
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<div>
				<dt>Accounts</dt>
				<dd>{String(accountsQuery.data?.length ?? 0)}</dd>
			</div>
			<div>
				<dt>Posts</dt>
				<dd>{String(postsQuery.data?.length ?? 0)}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.LensNetwork}
			{entityId}
		>
			<QueryBoundary
				query={networkQuery}
			>
				{#snippet children(_rows)}
					<dl>
						<div>
							<dt>Protocol name</dt>
							<dd>{String(networkFields?.protocolName ?? 'Lens')}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={String(networkFields?.homeUrl ?? '#')}>
									{String(networkFields?.homeUrl ?? '—')}
								</a>
							</dd>
						</div>
						{#if typeof networkFields?.docsUrl === 'string' && networkFields.docsUrl.length}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={networkFields.docsUrl}>
										{networkFields.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Registry
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section data-scroll-marker-label="Accounts">
						<LensAccountsView
							entityFieldReference={{
								entityType: EntityType.LensNetwork,
								entityId,
								fieldName: '$$lensAccounts',
							}}
							href={resolve('/(social)/lens')}
							id={`${networkIdKey}:accounts`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Recent posts">
						<LensPostsView
							entityFieldReference={{
								entityType: EntityType.LensNetwork,
								entityId,
								fieldName: '$$lensPosts',
							}}
							href={resolve('/(social)/lens')}
							id={`${networkIdKey}:posts`}
							open={false}
							title="Recent posts"
						/>
					</section>
				</div>
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:examples`}
				open={true}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Examples
						</HeadingComponent>
					</header>
				{/snippet}

				<ul>
					<li>
						<a href={resolve('/(social)/lens/account/[address]', {
							address: exampleAccountAddress,
						})}>
							Account example
						</a>
					</li>
					<li>
						<a href={resolve('/(social)/lens/post/[postId]', {
							postId: encodeURIComponent(examplePostId),
						})}>
							Post example
						</a>
					</li>
				</ul>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
