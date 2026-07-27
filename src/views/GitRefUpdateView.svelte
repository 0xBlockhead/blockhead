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
	}: EntitySelectionViewProps<EntityType.GitRefUpdate> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitRefUpdate = $derived(selection({
		fields: {
			updateKind: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.refName ?? '') || 'Git ref update')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
	import GitSignatureView from '$/views/GitSignatureView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRefUpdate}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.refName ?? '') || 'Git ref update'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitRefUpdate}>
			{#snippet children(entity)}
				{entity.updateKind || pendingEntity.refName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitRefUpdate}>
			{#snippet children(entity)}
				{@const timestampMs0 = entity.timestampMs}
				{#if timestampMs0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
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
				<dt>ref name</dt>
				<dd>
					{pendingEntity.refName}
				</dd>
			</div>

			<div>
				<dt>old object ID</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.oldObjectId)} />
				</dd>
			</div>

			<div>
				<dt>new object ID</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.newObjectId)} />
				</dd>
			</div>

			<div>
				<dt>update kind</dt>
				<dd>
					<ResourceBoundary
						resource={gitRefUpdate}
					>
						{#snippet children(entity)}
							{entity.updateKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitRefUpdate}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$signature}
			>
				{#snippet children(gitSignature)}
					{#if gitSignature != null}
						<div>
							<dt>signature</dt>
							<dd>
								<GitSignatureView
									selection={select(EntityType.GitSignature, gitSignature[EntityMetaKey.Selector])}
									prefetched={gitSignature}
									layout={EntityLayout.Value}
									open={false}
								/>
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
