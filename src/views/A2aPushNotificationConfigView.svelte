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
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.A2aPushNotificationConfig>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.A2aPushNotificationConfig>>
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
	const a2aPushNotificationConfig = $derived(selection({
		sources: [
			Source.A2aService_Http,
		],
		fields: {
			status: true,
			url: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.configId ?? prefetched.configId) ?? '')].filter(Boolean).join(' ') || 'A2A push notification config')
	const viewDomId = $derived('a2a-push-notification-config-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aPushNotificationConfig}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={a2aPushNotificationConfig}>
			{#snippet Pending()}
				{[String((selection.entitySelector.configId ?? prefetched.configId) ?? '')].filter(Boolean).join(' ') || title || 'A2A push notification config'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.configId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={a2aPushNotificationConfig}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.configId ?? prefetched.configId) ?? '')].filter(Boolean).join(' ') || title || 'A2A push notification config'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.configId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aPushNotificationConfig}>
			{#snippet Pending()}
				{@const url0 = prefetched.url}
				{#if url0 !== undefined && url0 !== null}
					<span data-text="muted">
						<svelte:element
							this={'a'}
							href={String(url0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(url0)} />
						</svelte:element>
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const url0 = resolvedEntity.url}
				{#if url0 !== undefined && url0 !== null}
					<span data-text="muted">
						<svelte:element
							this={'a'}
							href={String(url0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(url0)} />
						</svelte:element>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>task</dt>
				<dd>
					<A2aTaskView
						selection={select(EntityType.A2aTask, selection.entitySelector.$task, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>config ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									configId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const configId = selection.entitySelector.configId ?? prefetched.configId}
							{#if configId !== undefined && configId !== null}
								{String((configId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const configId = resolvedEntity.configId}
							{#if configId !== undefined && configId !== null}
								{String((configId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							url: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const url = prefetched.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const url = resolvedEntity.url}
					{#if url !== undefined && url !== null}
						<div>
							<dt>URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authKind = prefetched.authKind}
					{#if authKind !== undefined && authKind !== null}
						<div>
							<dt>auth kind</dt>
							<dd>
								{String((authKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authKind = resolvedEntity.authKind}
					{#if authKind !== undefined && authKind !== null}
						<div>
							<dt>auth kind</dt>
							<dd>
								{String((authKind) ?? '')}
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
				{#snippet Pending()}
					{@const createdAt = prefetched.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deletedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deletedAt = prefetched.deletedAt}
					{#if deletedAt !== undefined && deletedAt !== null}
						<div>
							<dt>deleted AT</dt>
							<dd>
								<Timestamp timestamp={Number(deletedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deletedAt = resolvedEntity.deletedAt}
					{#if deletedAt !== undefined && deletedAt !== null}
						<div>
							<dt>deleted AT</dt>
							<dd>
								<Timestamp timestamp={Number(deletedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
