<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(nostr)/nostr/profile/[pubkey]', {
			pubkey: selection.entitySelector.pubkey,
		}),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrProfile>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const profile = $derived(selection({
		sources: [
				Source.Constants_Internal,
		],
		fields: {
			pubkey: true,
			displayName: true,
			about: true,
			nip05: true,
			lud16: true,
			lud06: true,
			website: true,
			metadataUpdatedAt: true,
			$icon: true,
			$banner: true,
			...(open && {
				$$notes: {
					sources: [
						Source.Constants_Internal,
					],
				},
				$$articles: {
					sources: [
						Source.Constants_Internal,
					],
				},
				$$reposts: {
					sources: [
						Source.Constants_Internal,
					],
				},
			}),
		},
	}))

	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrProfile}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(profile)}
				{#if (
					profile.fields.$icon
					&& profile.fields.$icon[EntityMetaKey.Selector].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={profile.fields.$icon[EntityMetaKey.Selector].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.pubkey}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(profile)}
				{#if profile.fields.displayName}
					{profile.fields.displayName}
				{:else}
					{#if Value}
					{@render Value()}
				{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-0 profile metadata—display name, bio, nip-05, lud16, and avatar—is a signed replaceable event keyed by pubkey.
		</p>
		<p>
			The profile id is the author’s 64-character lowercase hex pubkey (secp256k1 x-only).
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(profile)}
				{#if profile.fields.about}
					<p>
						<TruncatedValue
							value={profile.fields.about}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(profile)}
				<dl data-column-item="center">
					{#if profile.fields.nip05}
						<div>
							<dt>NIP-05</dt>
							<dd>
								{profile.fields.nip05}
							</dd>
						</div>
					{/if}

						{#if open}
							<div>
								<dt>Pubkey</dt>
							<dd>
								<TruncatedValue
									value={profile.fields.pubkey}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}

					{#if open && profile.fields.$banner?.[EntityMetaKey.Selector].url}
						<div>
							<dt>Banner</dt>
							<dd>
								<img
									src={profile.fields.$banner[EntityMetaKey.Selector].url}
									alt=""
								/>
							</dd>
						</div>
					{/if}

					{#if open && profile.fields.website}
						<div>
							<dt>Website</dt>
							<dd>
								<a
									href={profile.fields.website}
									rel="noreferrer"
									target="_blank"
								>{profile.fields.website}</a>
							</dd>
						</div>
					{/if}

					{#if open && profile.fields.lud16}
						<div>
							<dt>Lightning address</dt>
							<dd>
								{profile.fields.lud16}
							</dd>
						</div>
					{/if}

					{#if open && profile.fields.lud06}
						<div>
							<dt>Lightning URI</dt>
							<dd>
								{profile.fields.lud06}
							</dd>
						</div>
					{/if}

					{#if open && profile.fields.metadataUpdatedAt != null}
						<div>
							<dt>Metadata updated</dt>
							<dd>
								<Timestamp
									timestamp={profile.fields.metadataUpdatedAt}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const idKey = stringify(selection.entitySelector)}
		<CollapsibleTabs
			id={`${idKey}:carousel-profile-feed`}
			sectionIdPrefix={idKey}
			sections={collapsibleTabsSections([
				{ id: 'notes', label: 'Notes' },
				{ id: 'articles', label: 'Articles' },
				{ id: 'reposts', label: 'Reposts' },
			])}
			data-card
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Profile feed
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNotes()}
				<NostrNotesView
					CollapsibleProps={{ canToggle: false }}
					href={resolve(
						'/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/notes',
						{ pubkey: selection.entitySelector.pubkey },
					)}
					selection={selection.$$notes}
					id={`${idKey}:notes`}
					open={true}
					title="Notes"
				/>
			{/snippet}

			{#snippet SectionArticles()}
				<NostrArticlesView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$articles}
					id={`${idKey}:articles`}
					open={true}
					title="Articles"
				/>
			{/snippet}

			{#snippet SectionReposts()}
				<NostrRepostsView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$reposts}
					id={`${idKey}:reposts`}
					open={true}
					title="Reposts"
				/>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
