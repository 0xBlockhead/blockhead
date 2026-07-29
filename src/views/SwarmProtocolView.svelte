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
	}: EntitySelectionViewProps<EntityType.SwarmProtocol> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const swarmProtocol = $derived(viewSelection({
		fields: {
			protocolName: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'Swarm protocol')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.SwarmProtocol}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve('/(swarm)/swarm')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={swarmProtocol}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={swarmProtocol}>
			{#snippet children(entity)}
				{entity.relationshipModel || entity.protocolName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol name</dt>
				<dd>
					<ResourceBoundary
						resource={swarmProtocol}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Registry name name</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									registryName: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.registryName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Home URL</dt>
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
							<dt>Docs URL</dt>
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

			<div>
				<dt>Connection model</dt>
				<dd>
					<ResourceBoundary
						resource={swarmProtocol}
					>
						{#snippet children(entity)}
							{entity.relationshipModel}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
