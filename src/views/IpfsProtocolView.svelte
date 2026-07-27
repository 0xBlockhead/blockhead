<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
	}: EntitySelectionViewProps<EntityType.IpfsProtocol> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const ipfsProtocol = $derived(viewSelection({
		fields: {
			protocolName: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.protocolName ?? '') || 'IPFS protocol')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsProtocol}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={href ?? resolve('/(explore)/(ipfs)/ipfs')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ipfsProtocol}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ipfsProtocol}>
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
						resource={ipfsProtocol}
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
								href={String(entity.homeUrl)}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={String(entity.homeUrl)} />
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
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
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
						resource={ipfsProtocol}
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
