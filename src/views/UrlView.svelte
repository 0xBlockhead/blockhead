<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.Url> = $props()


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Url}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.url || 'URL')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/url/[url=absoluteUrl]',
				{
					url: encodeURIComponent(selection.entitySelector.url),
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
		<a
			href={selection.entitySelector.url}
			target="_blank"
			rel="noreferrer noopener"
		>
			<TruncatedValue value={selection.entitySelector.url} />
		</a>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.url} />
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>URL</dt>
				<dd>
					<a
						href={selection.entitySelector.url}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.url} />
					</a>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
