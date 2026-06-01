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


	// State
	let {
		entityId,
		href = resolve('/(social)/(lens)/lens/account/[address]', {
			address: entityId.address,
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const lensAccount = useEntity(
		EntityType.LensAccount,
		entityId,
		{
			$: [
				Source.Lens_Graphql,
				Source.Hey_Graphql,
			],
			localName: {},
			displayName: {},
			bio: {},
			createdAt: {},
			followerCount: {},
			followingCount: {},
			$$timestamps: {
				$: [
					Source.Lens_Graphql,
					Source.Hey_Graphql,
				],
				$limit: 1,
			},
			$icon: {},
		},
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
				{#if lensAccount.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						shape={IconShape.Circle}
						src={lensAccount.$icon[EntityMetaKey.Id].url}
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
			{entityId.address}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={lensAccount}
			placeholderText="Loading Lens profile…"
		>
			{#snippet children(lensAccount)}
				{lensAccount.displayName
					?? lensAccount.localName
					?? entityId.address}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={lensAccount}
		>
			{#snippet children(lensAccount)}
				{#if (
					lensAccount.localName != null
					&& lensAccount.localName !== ''
					&& lensAccount.localName !== (
						lensAccount.displayName
						?? lensAccount.localName
						?? entityId.address
					)
				)}
					<span data-text="muted">
						@{lensAccount.localName}
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
				{#if lensAccount.bio != null && lensAccount.bio !== ''}
					<p>
						<TruncatedValue
							value={lensAccount.bio}
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
									value: lensAccount.$$timestamps[0]?.followerCount ?? lensAccount.followerCount,
								},
								{
									label: 'Following',
									value: lensAccount.$$timestamps[0]?.followingCount ?? lensAccount.followingCount,
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
						{#if lensAccount.createdAt != null}
							<div>
								<dt>Account created</dt>
								<dd>
									<Timestamp
										timestamp={lensAccount.createdAt}
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
						<LensPostsView
						CollapsibleProps={{ canToggle: false }}
							href={resolve(
								'/(social)/(lens)/lens/account/[address]/(account)/posts',
								{ address: entityId.address },
							)}
						entityFieldReference={{
							entityType: EntityType.LensAccount,
							entityId,
							fieldName: '$$posts',
						}}
						id={`${idKey}:posts-lensAccounts`}
						/>
					{/snippet}

					{#snippet SectionMetricSnapshots()}
						<LensAccount_TimestampsView
							entityFieldReference={{
								entityType: EntityType.LensAccount,
								entityId,
								fieldName: '$$timestamps',
							}}
							href={href}
							id={`${idKey}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}
			</CollapsibleTabs>

		{/snippet}
	</EntityView>
