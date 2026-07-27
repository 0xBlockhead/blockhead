<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LensUsernameNamespace> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const lensUsernameNamespace = $derived(selection({
		fields: {
			namespace: true,
			tokenName: true,
			totalUsernames: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.namespace ?? ''), (pendingEntity.tokenName ?? '')].filter(Boolean).join(' ') || 'Lens username namespace')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensUsernamesView from '$/views/LensUsernamesView.svelte'
</script>


<EntityView
	entityType={EntityType.LensUsernameNamespace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensUsernameNamespace}>
			{#snippet children(entity)}
				{[entity.namespace, (entity.tokenName ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={String(pendingEntity.address)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensUsernameNamespace}>
			{#snippet children(entity)}
				{@const totalUsernames0 = entity.totalUsernames}
				{#if totalUsernames0 != null}
					<span data-text="muted">
						{String(totalUsernames0)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={lensUsernameNamespace}
					>
						{#snippet children(entity)}
							{entity.namespace}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={lensUsernameNamespace}
			>
				{#snippet children(entity)}
					{@const tokenName = entity.tokenName}
					{#if tokenName != null}
						<div>
							<dt>Token name</dt>
							<dd>
								{tokenName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenSymbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenSymbol = entity.tokenSymbol}
					{#if tokenSymbol != null}
						<div>
							<dt>Token symbol</dt>
							<dd>
								{tokenSymbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={lensUsernameNamespace}
			>
				{#snippet children(entity)}
					{@const totalUsernames = entity.totalUsernames}
					{#if totalUsernames != null}
						<div>
							<dt>Total usernames</dt>
							<dd>
								{String(totalUsernames)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.address)} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							owner: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const owner = entity.owner}
					{#if owner != null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={String(owner)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
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

	{#snippet Details({ open: detailsOpen })}
		{@const lensUsernameNamespaceLensUsernamesViewUsernamesResource = selection.$$usernames}
		<ResourceBoundary
			resource={lensUsernameNamespaceLensUsernamesViewUsernamesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LensUsernamesView
						selection={lensUsernameNamespaceLensUsernamesViewUsernamesResource}
						countResource={lensUsernameNamespaceLensUsernamesViewUsernamesResource.count}
						title='Usernames'
						id='usernames'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
