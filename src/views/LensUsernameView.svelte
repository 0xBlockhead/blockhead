<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.LensUsername>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LensUsername>>
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
	const lensUsername = $derived(selection({
		fields: {
			value: true,
			timestamp: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.value) ?? ''), String((prefetched.localName) ?? '')].filter(Boolean).join(' ') || 'Lens username')
	const viewDomId = $derived('lens-username-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LensUsername}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensUsername}>
			{#snippet Pending()}
				{[String((prefetched.value) ?? ''), String((prefetched.localName) ?? '')].filter(Boolean).join(' ') || title || 'Lens username'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.value) ?? ''), String((resolvedEntity.localName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lensUsername}>
			{#snippet Pending()}
				{[String((prefetched.localName) ?? '')].filter(Boolean).join(' ') || [String((prefetched.value) ?? ''), String((prefetched.localName) ?? '')].filter(Boolean).join(' ') || title || 'Lens username'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.localName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.value) ?? ''), String((resolvedEntity.localName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={lensUsername}>
			{#snippet Pending()}
				{@const timestamp0 = prefetched.timestamp}
				{#if timestamp0 !== undefined && timestamp0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestamp0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestamp0 = resolvedEntity.timestamp}
				{#if timestamp0 !== undefined && timestamp0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestamp0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Local name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									localName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const localName = prefetched.localName}
							{#if localName !== undefined && localName !== null}
								{String((localName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const localName = resolvedEntity.localName}
							{#if localName !== undefined && localName !== null}
								{String((localName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const value = prefetched.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								{String((value) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const value = resolvedEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								{String((value) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							id: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const id = prefetched.id}
					{#if id !== undefined && id !== null}
						<div>
							<dt>ID</dt>
							<dd>
								{String((id) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const id = resolvedEntity.id}
					{#if id !== undefined && id !== null}
						<div>
							<dt>ID</dt>
							<dd>
								{String((id) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestamp = prefetched.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestamp = resolvedEntity.timestamp}
					{#if timestamp !== undefined && timestamp !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestamp)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									namespace: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const namespace = prefetched.namespace}
							{#if namespace !== undefined && namespace !== null}
								<TruncatedValue value={String((namespace) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const namespace = resolvedEntity.namespace}
							{#if namespace !== undefined && namespace !== null}
								<TruncatedValue value={String((namespace) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Owned by</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ownedBy: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ownedBy = prefetched.ownedBy}
							{#if ownedBy !== undefined && ownedBy !== null}
								<TruncatedValue value={String((ownedBy) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ownedBy = resolvedEntity.ownedBy}
							{#if ownedBy !== undefined && ownedBy !== null}
								<TruncatedValue value={String((ownedBy) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							linkedTo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const linkedTo = prefetched.linkedTo}
					{#if linkedTo !== undefined && linkedTo !== null}
						<div>
							<dt>Linked to</dt>
							<dd>
								<TruncatedValue value={String((linkedTo) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const linkedTo = resolvedEntity.linkedTo}
					{#if linkedTo !== undefined && linkedTo !== null}
						<div>
							<dt>Linked to</dt>
							<dd>
								<TruncatedValue value={String((linkedTo) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
