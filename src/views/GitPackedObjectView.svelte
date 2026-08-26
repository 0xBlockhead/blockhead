<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.GitPackedObject>, 'prefetched'> = $props()

	const gitPackedObject = $derived(selection({
		fields: {
			storedKind: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.objectId || 'Git packed object')


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
	href={
		href === undefined ?
			resolve(
				'/git/pack/[packHash=zeroExHex]/(gitPackfile)/object/[objectId=zeroExHex]/[objectFormat=stringSegment]',
				{
					packHash: selection.entitySelector.packHash,
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
		<ResourceBoundary resource={gitPackedObject}>
			{#snippet children(entity)}
				{(entity.storedKind ?? '') || selection.entitySelector.objectId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$packfile}
		>
			{#snippet children(gitPackfile)}
				{@const gitPackfileInitial = untrack(() => gitPackfile)}
				<span data-text="muted">
					<GitPackfileView
						selection={select(EntityType.GitPackfile, (gitPackfile ?? gitPackfileInitial)[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
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
								{deltaBaseObjectId}
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
							{@const gitPackfileInitial = untrack(() => gitPackfile)}
							<GitPackfileView
								selection={select(EntityType.GitPackfile, (gitPackfile ?? gitPackfileInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
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
						{@const gitObjectInitial = untrack(() => gitObject)}
						<div>
							<dt>object</dt>
							<dd>
								<GitObjectView
									selection={select(EntityType.GitObject, (gitObject ?? gitObjectInitial)[EntityMetaKey.Selector])}
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
