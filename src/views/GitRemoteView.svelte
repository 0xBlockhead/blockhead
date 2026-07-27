<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GitRemote> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitRemote = $derived(selection({
		fields: {
			url: true,
			transportKind: true,
			hostKind: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.remoteName ?? '') || 'Git remote')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRemote}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.remoteName ?? '') || 'Git remote'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitRemote}>
			{#snippet children(entity)}
				<a
					href={String(entity.url)}
					target="_blank"
					rel="noreferrer noopener"
				>
					<TruncatedValue value={String(entity.url)} />
				</a>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRemote}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.transportKind}
				</span>
				{@const hostKind1 = entity.hostKind}
				{#if hostKind1 != null}
					<span data-text="muted">
						{hostKind1}
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
					{pendingEntity.remoteName}
				</dd>
			</div>

			<div>
				<dt>URL</dt>
				<dd>
					<ResourceBoundary
						resource={gitRemote}
					>
						{#snippet children(entity)}
							<a
								href={String(entity.url)}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={String(entity.url)} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transport kind</dt>
				<dd>
					<ResourceBoundary
						resource={gitRemote}
					>
						{#snippet children(entity)}
							{entity.transportKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitRemote}
			>
				{#snippet children(entity)}
					{@const hostKind = entity.hostKind}
					{#if hostKind != null}
						<div>
							<dt>host kind</dt>
							<dd>
								{hostKind}
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
				{#snippet children(entity)}
					{@const source = entity.source}
					{#if source != null}
						<div>
							<dt>Source</dt>
							<dd>
								{source}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
