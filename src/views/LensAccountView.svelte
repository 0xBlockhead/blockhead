<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(lens)/lens/account/[address]', {
			address: (
				'address' in entityId ? entityId.address
				: 'localName' in entityId ? entityId.localName
				: `legacy:${entityId.legacyProfileId}`
			),
		}),
		open = $bindable(true),
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

	const idKey = stringify(entityId)

	const lensAccount = subscribe(EntityType.LensAccount,
		entityId,
		({ sources: [
				Source.Lens_Graphql,
			], fields: { address: true, localName: true, displayName: true, bio: true, createdAt: true, followerCount: true, followingCount: true, $$timestamps: ({ sources: [
					Source.Lens_Graphql,
				], limit: 1 }), $icon: true } }),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LensAccount_TimestampsView from '$/views/LensAccount_TimestampsView.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccount}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={lensAccount}
			placeholderText="Loading Lens profile…"
		>
			{#snippet children(lensAccount)}
				{#if lensAccount.fields.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						shape={IconShape.Circle}
						src={lensAccount.fields.$icon[EntityMetaKey.Id].url}
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

	{#snippet Value()}
		<span data-text="font-monospace">
			{'address' in entityId ? entityId.address : 'localName' in entityId ? `@${entityId.localName}` : entityId.legacyProfileId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={lensAccount}
			placeholderText="Loading Lens profile…"
		>
			{#snippet children(lensAccount)}
				{lensAccount.fields.displayName
					?? lensAccount.fields.localName
					?? ('address' in entityId ? entityId.address : 'localName' in entityId ? entityId.localName : entityId.legacyProfileId)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={lensAccount}
		>
			{#snippet children(lensAccount)}
				{#if (
					lensAccount.fields.localName != null
					&& lensAccount.fields.localName !== ''
					&& lensAccount.fields.localName !== (
						lensAccount.fields.displayName
						?? lensAccount.fields.localName
						?? ('address' in entityId ? entityId.address : 'localName' in entityId ? entityId.localName : entityId.legacyProfileId)
					)
				)}
					<span data-text="muted">
						@{lensAccount.fields.localName}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens v3 profiles are on-chain accounts keyed by EVM address; usernames and avatars resolve from Lens GraphQL metadata, not legacy v2 profile ids.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={lensAccount}
			placeholderText="Loading Lens profile…"
		>
			{#snippet children(lensAccount)}
				{#if lensAccount.fields.bio != null && lensAccount.fields.bio !== ''}
					<p>
						<TruncatedValue
							value={lensAccount.fields.bio}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={lensAccount}
					placeholderText="Loading Lens profile…"
				>
					{#snippet children(lensAccount)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Followers',
									value: lensAccount.fields.$$timestamps[0]?.followerCount ?? lensAccount.fields.followerCount,
								},
								{
									label: 'Following',
									value: lensAccount.fields.$$timestamps[0]?.followingCount ?? lensAccount.fields.followingCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
			{/if}
			{#if open}
				<ResourceBoundary
					resource={lensAccount}
					placeholderText="Loading Lens profile…"
				>
					{#snippet children(lensAccount)}
						{#if lensAccount.fields.createdAt != null}
							<div>
								<dt>Account created</dt>
								<dd>
									<Timestamp
										timestamp={lensAccount.fields.createdAt}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${idKey}:carousel-activity`}
			sectionIdPrefix={idKey}
			sections={collapsibleTabsSections([
				{ id: 'lens-account-record', label: 'Record' },
				{ id: 'posts', label: 'Publications' },
				{ id: 'metric-snapshots', label: 'Metrics' },
			])}
			data-card
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

			{#snippet SectionLensAccountRecord()}
			{/snippet}

			{#snippet SectionPosts()}
				<ResourceBoundary
					resource={lensAccount}
					placeholderText="Loading Lens profile…"
				>
					{#snippet children(lensAccount)}
						<LensPostsView
							CollapsibleProps={{ canToggle: false }}
							href={resolve(
								'/(social)/(lens)/lens/account/[address]/(account)/posts',
								{ address: lensAccount.fields.address },
							)}
							entityFieldReference={{
								entityType: EntityType.LensAccount,
								entityId: {
									address: lensAccount.fields.address,
								},
								fieldName: '$$posts',
							}}
							id={`${idKey}:posts-lensAccounts`}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<ResourceBoundary
					resource={lensAccount}
					placeholderText="Loading Lens profile…"
				>
					{#snippet children(lensAccount)}
						<LensAccount_TimestampsView
							entityFieldReference={{
								entityType: EntityType.LensAccount,
								entityId: {
									address: lensAccount.fields.address,
								},
								fieldName: '$$timestamps',
							}}
							href={resolve('/(social)/(lens)/lens/account/[address]', {
								address: lensAccount.fields.address,
							})}
							id={`${idKey}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
