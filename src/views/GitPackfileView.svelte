<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.GitPackfile> = $props()

	const gitPackfile = $derived(selection({
		fields: {
			objectFormat: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.packHash || 'Git packfile')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitPackfile}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.packHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitPackfile}>
			{#snippet children(entity)}
				{entity.objectFormat || selection.entitySelector.packHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>pack hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.packHash} />
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					<ResourceBoundary
						resource={gitPackfile}
					>
						{#snippet children(entity)}
							{entity.objectFormat}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							objectCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const objectCount = entity.objectCount}
					{#if objectCount != null}
						<div>
							<dt>object count</dt>
							<dd>
								<NumberValue
									value={objectCount}
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
							packSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const packSizeBytes = entity.packSizeBytes}
					{#if packSizeBytes != null}
						<div>
							<dt>pack size bytes</dt>
							<dd>
								<NumberValue
									value={packSizeBytes}
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
							indexHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const indexHash = entity.indexHash}
					{#if indexHash != null}
						<div>
							<dt>index hash</dt>
							<dd>
								<TruncatedValue value={indexHash} />
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
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
