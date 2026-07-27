<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.GitBlob> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitBlob = $derived(selection({
		fields: {
			mime: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.objectId ?? '') || 'Git blob')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitTreeEntriesView from '$/views/GitTreeEntriesView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitBlob}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={String(pendingEntity.objectId)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitBlob}>
			{#snippet children(entity)}
				{(entity.mime ?? '') || String(pendingEntity.objectId) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>object ID</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.objectId)} />
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					{pendingEntity.objectFormat}
				</dd>
			</div>

			<div>
				<dt>object</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$object}
					>
						{#snippet children(gitObject)}
							<GitObjectView
								selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
								prefetched={gitObject}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitBlob}
			>
				{#snippet children(entity)}
					{@const mime = entity.mime}
					{#if mime != null}
						<div>
							<dt>mime</dt>
							<dd>
								{mime}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							byteSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const byteSize = entity.byteSize}
					{#if byteSize != null}
						<div>
							<dt>byte size</dt>
							<dd>
								<NumberValue
									value={byteSize}
								/>
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
						textSample: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const textSample = entity.textSample}
				{#if textSample != null && textSample !== ''}
					<p data-text="long-text">{textSample}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const gitBlobGitTreeEntriesViewPathsResource = selection.$$paths}
		<ResourceBoundary
			resource={gitBlobGitTreeEntriesViewPathsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitTreeEntriesView
						selection={gitBlobGitTreeEntriesViewPathsResource}
						countResource={gitBlobGitTreeEntriesViewPathsResource.count}
						title='paths'
						id='paths'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
