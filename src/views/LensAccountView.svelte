<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/(social)/lens/account/[address]', {
			address: entityId.address,
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LensAccount>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const lensAccount = useEntity(
		EntityType.LensAccount,
		entityId,
		{
			$: [
				Source.Lens_Graphql,
				Source.Lens_HeyGraphql,
			],
			localName: {},
			displayName: {},
			bio: {},
			createdAt: {},
			followerCount: {},
			followingCount: {},
			$icon: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccount}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens v3 profiles are on-chain accounts keyed by EVM address; usernames and avatars resolve from Lens GraphQL metadata, not legacy v2 profile ids.
		</p>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={lensAccount}
			placeholderText="Loading Lens profile…"
		>
			{#snippet children(loadedLensAccount)}
				{loadedLensAccount.displayName
					?? loadedLensAccount.localName
					?? entityId.address}
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
		<ResourceBoundary
			resource={lensAccount}
			placeholderText="Loading Lens profile…"
		>
			{#snippet children(loadedLensAccount)}
				{#if loadedLensAccount.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						shape={IconShape.Circle}
						src={loadedLensAccount.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{:else}
					<IconComponent
						shape={IconShape.Circle}
						icon="L"
						label="Lens"
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={lensAccount}
		>
			{#snippet children(loadedLensAccount)}
				{#if (
					lensAccount.localName != null
					&& lensAccount.localName !== ''
					&& lensAccount.localName !== (
						lensAccount.displayName
						?? loadedLensAccount.localName
						?? entityId.address
					)
				)}
					<span data-text="muted">
						@{loadedLensAccount.localName}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Bio</dt>
				<dd>
					<ResourceBoundary
						resource={lensAccount}
						placeholderText="Loading Lens profile…"
					>
						{#snippet children(loadedLensAccount)}
							{#if loadedLensAccount.bio != null && loadedLensAccount.bio !== ''}
								{loadedLensAccount.bio}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if (
				open
				&& lensAccount.followerCount != null
			)}
				<div>
					<dt>Followers</dt>
					<dd>
						<ResourceBoundary
							resource={lensAccount}
							placeholderText="Loading Lens profile…"
						>
							{#snippet children(loadedLensAccount)}
								<NumberValue
									value={loadedLensAccount.followerCount}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& lensAccount.followingCount != null
			)}
				<div>
					<dt>Following</dt>
					<dd>
						<ResourceBoundary
							resource={lensAccount}
							placeholderText="Loading Lens profile…"
						>
							{#snippet children(loadedLensAccount)}
								<NumberValue
									value={loadedLensAccount.followingCount}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& lensAccount.createdAt != null
			)}
				<div>
					<dt>Account created</dt>
					<dd>
						<ResourceBoundary
							resource={lensAccount}
							placeholderText="Loading Lens profile…"
						>
							{#snippet children(loadedLensAccount)}
								<Timestamp
									timestamp={loadedLensAccount.createdAt}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
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
							Lens profile &amp; publications
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
					>Publications</a>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
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
							href={resolve(
			'/(social)/(lens)/lens/account/[address]/(account)/posts',
			{ address: entityId.address },
		)}
							entityFieldReference={{
								entityType: EntityType.LensAccount,
								entityId,
								fieldName: '$$posts',
							}}
							id={`${idKey}:posts-list`}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>
