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
	}: EntitySelectionViewProps<EntityType.GitObject> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitObject = $derived(selection({
		fields: {
			objectKind: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.objectId ?? '') || 'Git object')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitObject}
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
		<ResourceBoundary resource={gitObject}>
			{#snippet children(entity)}
				{[entity.objectKind, pendingEntity.objectFormat].filter(Boolean).join(' ') || String(pendingEntity.objectId) || titleFallback}
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
				<dt>object kind</dt>
				<dd>
					<ResourceBoundary
						resource={gitObject}
					>
						{#snippet children(entity)}
							{entity.objectKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sizeBytes = entity.sizeBytes}
					{#if sizeBytes != null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue
									value={sizeBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$repository}
			>
				{#snippet children(gitRepository)}
					{#if gitRepository != null}
						<div>
							<dt>repository</dt>
							<dd>
								<GitRepositoryView
									selection={select(EntityType.GitRepository, gitRepository[EntityMetaKey.Selector])}
									prefetched={gitRepository}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
