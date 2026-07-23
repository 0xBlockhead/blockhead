<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.LensUsernameNamespace>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LensUsernameNamespace>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const lensUsernameNamespace = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			namespace: true,
			tokenName: true,
			totalUsernames: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			namespace: true,
			tokenName: true,
			totalUsernames: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.namespace) ?? ''), String((pendingEntity.tokenName) ?? '')].filter(Boolean).join(' ') || 'Lens username namespace')
	const viewDomId = $derived('lens-username-namespace-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LensUsernamesView from '$/views/LensUsernamesView.svelte'
</script>


<EntityView
	entityType={EntityType.LensUsernameNamespace}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'namespace') && Object.hasOwn(prefetched, 'tokenName') && Object.hasOwn(prefetched, 'totalUsernames')}
			{[String((pendingEntity.namespace) ?? ''), String((pendingEntity.tokenName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={lensUsernameNamespace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.namespace) ?? ''), String((resolvedEntity.tokenName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'namespace') && Object.hasOwn(prefetched, 'tokenName') && Object.hasOwn(prefetched, 'totalUsernames')}
			{@const address0 = pendingEntity.address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String((address0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={lensUsernameNamespace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address0 = resolvedEntity.address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String((address0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'namespace') && Object.hasOwn(prefetched, 'tokenName') && Object.hasOwn(prefetched, 'totalUsernames')}
			{@const totalUsernames0 = pendingEntity.totalUsernames}
			{#if totalUsernames0 !== undefined && totalUsernames0 !== null}
				<span data-text="muted">
					{String((totalUsernames0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={lensUsernameNamespace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalUsernames0 = resolvedEntity.totalUsernames}
					{#if totalUsernames0 !== undefined && totalUsernames0 !== null}
						<span data-text="muted">
							{String((totalUsernames0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									namespace: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const namespace = resolvedEntity.namespace}
							{#if namespace !== undefined && namespace !== null}
								{String((namespace) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							tokenName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenName = resolvedEntity.tokenName}
					{#if tokenName !== undefined && tokenName !== null}
						<div>
							<dt>Token name</dt>
							<dd>
								{String((tokenName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							tokenSymbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenSymbol = resolvedEntity.tokenSymbol}
					{#if tokenSymbol !== undefined && tokenSymbol !== null}
						<div>
							<dt>Token symbol</dt>
							<dd>
								{String((tokenSymbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							totalUsernames: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalUsernames = resolvedEntity.totalUsernames}
					{#if totalUsernames !== undefined && totalUsernames !== null}
						<div>
							<dt>Total usernames</dt>
							<dd>
								{String((totalUsernames) ?? '')}
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									address: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							owner: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const owner = resolvedEntity.owner}
					{#if owner !== undefined && owner !== null}
						<div>
							<dt>Owner</dt>
							<dd>
								<TruncatedValue value={String((owner) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
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
					sources: selection.sources,
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const description = resolvedEntity.description}
				{#if description !== undefined && description !== null && description !== ''}
					<p data-text="long-text">{String((description) ?? '')}</p>
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
					id='LensUsernamesView-usernames'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
