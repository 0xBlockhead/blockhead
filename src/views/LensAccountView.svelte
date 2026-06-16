<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
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
		selector,
		href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.LensAccount>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const idKey = $derived(stringify(selector))

	const lensAccount = $derived(subscribe(EntityType.LensAccount,
		selector,
		{
			sources: [
				Source.Lens_Graphql,
			],
			fields: {
				address: true,
				displayName: true,
				bio: true,
				createdAt: true,
				$$timestamps: {
					sources: [
						Source.Lens_Graphql,
					],
					limit: 1,
				},
				$icon: true,
			},
		},
	))


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
	entitySelector={selector}
	href={href ?? resolve('/(social)/(lens)/lens/account/[address]', {
		address: (
			'address' in selector ? selector.address
			: 'localName' in selector ? selector.localName
			: `legacy:${selector.legacyProfileId}`
		),
	})}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={lensAccount}
			placeholderText="Loading Lens profile…"
		>
			{#snippet children(lensAccount)}
				{#if lensAccount.fields.$icon?.[EntityMetaKey.Selector].url}
					<IconComponent
						shape={IconShape.Circle}
						src={lensAccount.fields.$icon[EntityMetaKey.Selector].url}
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
			{'address' in selector ? selector.address : 'localName' in selector ? `@${selector.localName}` : selector.legacyProfileId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={lensAccount}
			placeholderText="Loading Lens profile…"
		>
			{#snippet children(lensAccount)}
				{lensAccount.fields.displayName
					?? ('address' in selector ? selector.address : 'localName' in selector ? selector.localName : selector.legacyProfileId)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={lensAccount}
		>
			{#snippet children(lensAccount)}
				{#if 'localName' in selector && selector.localName !== lensAccount.fields.displayName}
					<span data-text="muted">
						@{selector.localName}
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
									value: lensAccount.fields.$$timestamps.values.at(0)?.followerCount,
								},
								{
									label: 'Following',
									value: lensAccount.fields.$$timestamps.values.at(0)?.followingCount,
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
								selector: {
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
								selector: {
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
