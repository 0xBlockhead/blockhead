<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.YoutubeNetwork> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const youtubeNetwork = $derived(viewSelection({
		fields: {
			protocolName: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'YouTube Data API')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve('/(social)/(youtube)/youtube/(globalYoutubeNetwork)/api')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={youtubeNetwork}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={youtubeNetwork}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Home</dt>
					<dd>
						<ResourceBoundary
							resource={
								viewSelection({
									fields: {
										homeUrl: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								<a
									href={entity.homeUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={entity.homeUrl} />
								</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								docsUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const docsUrl = entity.docsUrl}
						{#if docsUrl != null}
							<div>
								<dt>Documentation</dt>
								<dd>
									<a
										href={docsUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={docsUrl} />
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
