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
	}: EntitySelectionViewProps<EntityType.GitPackedObject> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitPackedObject = $derived(selection({
		fields: {
			storedKind: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.objectId ?? '') || 'Git packed object')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitPackfileView from '$/views/GitPackfileView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitPackedObject}
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
		<ResourceBoundary resource={gitPackedObject}>
			{#snippet children(entity)}
				{(entity.storedKind ?? '') || String(pendingEntity.objectId) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$packfile}
		>
			{#snippet children(gitPackfile)}
				<span data-text="muted">
					<GitPackfileView
						selection={select(EntityType.GitPackfile, gitPackfile[EntityMetaKey.Selector])}
						prefetched={gitPackfile}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>pack hash</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.packHash)} />
				</dd>
			</div>

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							offset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const offset = entity.offset}
					{#if offset != null}
						<div>
							<dt>offset</dt>
							<dd>
								<NumberValue
									value={offset}
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
							deltaBaseObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deltaBaseObjectId = entity.deltaBaseObjectId}
					{#if deltaBaseObjectId != null}
						<div>
							<dt>delta base object ID</dt>
							<dd>
								{String(deltaBaseObjectId)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={gitPackedObject}
			>
				{#snippet children(entity)}
					{@const storedKind = entity.storedKind}
					{#if storedKind != null}
						<div>
							<dt>stored kind</dt>
							<dd>
								{storedKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>packfile</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$packfile}
					>
						{#snippet children(gitPackfile)}
							<GitPackfileView
								selection={select(EntityType.GitPackfile, gitPackfile[EntityMetaKey.Selector])}
								prefetched={gitPackfile}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$object}
			>
				{#snippet children(gitObject)}
					{#if gitObject != null}
						<div>
							<dt>object</dt>
							<dd>
								<GitObjectView
									selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
									prefetched={gitObject}
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
