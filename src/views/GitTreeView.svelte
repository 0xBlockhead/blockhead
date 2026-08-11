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
	}: Omit<EntitySelectionViewProps<EntityType.GitTree>, 'prefetched'> = $props()

	const titleFallback = $derived(selection.entitySelector.objectId || 'Git tree')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitTreeEntriesView from '$/views/GitTreeEntriesView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitTree}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/tree/[objectId=zeroExHex]/[objectFormat=stringSegment]',
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
		{selection.entitySelector.objectFormat || selection.entitySelector.objectId || titleFallback}
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
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const entriesResource = selection.$$entries}
		<ResourceBoundary
			resource={entriesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitTreeEntriesView
						selection={entriesResource}
						countResource={entriesResource.count}
						title='entries'
						id='entries'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
