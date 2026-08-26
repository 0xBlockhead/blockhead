<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LensFeed> = $props()

	const lensFeed = $derived(selection({
		fields: {
			name: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), selection.entitySelector.address].filter(Boolean).join(' ') || 'Lens feed')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensFeedRulesView from '$/views/LensFeedRulesView.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.LensFeed}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(lens)/lens/(lensNetwork)/feed/[address=evmAddress]',
				{
					address: selection.entitySelector.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensFeed}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), selection.entitySelector.address].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensFeed}>
			{#snippet children(entity)}
				{@const createdAt = entity.createdAt}
				{#if createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={lensFeed}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$owner}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						{@const evmAccountInitial = untrack(() => evmAccount)}
						<div>
							<dt>Owner account</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={lensFeed}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const rulesResource = selection.$$rules}
		<ResourceBoundary
			resource={rulesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LensFeedRulesView
						selection={rulesResource}
						countResource={rulesResource.count}
						title='Rules'
						id='rules'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const postsResource = selection.$$posts}
		<ResourceBoundary
			resource={postsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LensPostsView
						selection={postsResource}
						countResource={postsResource.count}
						title='Posts'
						id='posts'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
