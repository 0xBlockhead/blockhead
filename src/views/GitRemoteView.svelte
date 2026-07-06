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
			selection: EntityProxyResource<typeof schema, EntityType.GitRemote>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitRemote>>
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
	const gitRemote = $derived(selection({
		fields: {
			url: true,
			transportKind: true,
			hostKind: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.remoteName ?? prefetched.remoteName) ?? '')].filter(Boolean).join(' ') || 'Git remote')
	const viewDomId = $derived('git-remote-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRemote}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitRemote}>
			{#snippet Pending()}
				{[String((selection.entitySelector.remoteName ?? prefetched.remoteName) ?? '')].filter(Boolean).join(' ') || title || 'Git remote'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.remoteName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitRemote}>
			{#snippet Pending()}
				{@const url0 = prefetched.url}
				{#if url0 !== undefined && url0 !== null}
					<svelte:element
						this={'a'}
						href={String(url0)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(url0)} />
					</svelte:element>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const url0 = resolvedEntity.url}
				{#if url0 !== undefined && url0 !== null}
					<svelte:element
						this={'a'}
						href={String(url0)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(url0)} />
					</svelte:element>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRemote}>
			{#snippet Pending()}
				{@const transportKind0 = prefetched.transportKind}
				{#if transportKind0 !== undefined && transportKind0 !== null}
					<span data-text="muted">
						{String((transportKind0) ?? '')}
					</span>
				{/if}
				{@const hostKind1 = prefetched.hostKind}
				{#if hostKind1 !== undefined && hostKind1 !== null}
					<span data-text="muted">
						{String((hostKind1) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const transportKind0 = resolvedEntity.transportKind}
				{#if transportKind0 !== undefined && transportKind0 !== null}
					<span data-text="muted">
						{String((transportKind0) ?? '')}
					</span>
				{/if}
				{@const hostKind1 = resolvedEntity.hostKind}
				{#if hostKind1 !== undefined && hostKind1 !== null}
					<span data-text="muted">
						{String((hostKind1) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<GitRepositoryView
						selection={select(EntityType.GitRepository, selection.entitySelector.$repository)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>remote name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									remoteName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const remoteName = selection.entitySelector.remoteName ?? prefetched.remoteName}
							{#if remoteName !== undefined && remoteName !== null}
								{String((remoteName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const remoteName = resolvedEntity.remoteName}
							{#if remoteName !== undefined && remoteName !== null}
								{String((remoteName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>URL</dt>
				<dd>
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
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const url = resolvedEntity.url}
							{#if url !== undefined && url !== null}
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transport kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transportKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transportKind = prefetched.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transportKind = resolvedEntity.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hostKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hostKind = prefetched.hostKind}
					{#if hostKind !== undefined && hostKind !== null}
						<div>
							<dt>host kind</dt>
							<dd>
								{String((hostKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hostKind = resolvedEntity.hostKind}
					{#if hostKind !== undefined && hostKind !== null}
						<div>
							<dt>host kind</dt>
							<dd>
								{String((hostKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							source: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const source = prefetched.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source = resolvedEntity.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
