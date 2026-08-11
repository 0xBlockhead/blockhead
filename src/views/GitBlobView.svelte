<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.GitBlob>, 'prefetched'> = $props()

	const gitBlob = $derived(selection({
		fields: {
			mime: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.objectId || 'Git blob')


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
	href={
		href === undefined ?
			resolve(
				'/git/blob/[objectId=zeroExHex]/[objectFormat=stringSegment]',
				{
					objectId: selection.entitySelector.objectId,
					objectFormat: selection.entitySelector.objectFormat,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.objectId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitBlob}>
			{#snippet children(entity)}
				{(entity.mime ?? '') || selection.entitySelector.objectId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>object ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.objectId} />
				</dd>
			</div>

			<div>
				<dt>object format</dt>
				<dd>
					{selection.entitySelector.objectFormat}
				</dd>
			</div>

			<div>
				<dt>object</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$object}
					>
						{#snippet children(gitObject)}
							{@const gitObjectInitial = untrack(() => gitObject)}
							<GitObjectView
								selection={select(EntityType.GitObject, (gitObject ?? gitObjectInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
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

	{#snippet Details()}
		{@const pathsResource = selection.$$paths}
		<ResourceBoundary
			resource={pathsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitTreeEntriesView
						selection={pathsResource}
						countResource={pathsResource.count}
						title='paths'
						id='paths'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
