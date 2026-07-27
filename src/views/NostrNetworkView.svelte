<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.NostrNetwork> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const nostrNetwork = $derived(selection({
		fields: {
			protocolName: true,
			registryName: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.protocolName ?? '') || (pendingEntity.scope ?? '') || 'Nostr network')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.NostrNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrNetwork}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nostrNetwork}>
			{#snippet children(entity)}
				{entity.registryName || entity.protocolName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Compatibility protocol row for the Nostr network concept. The product-backed observed is modeled by _GlobalNostrNetwork.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					{pendingEntity.scope}
				</dd>
			</div>

			<div>
				<dt>protocol name</dt>
				<dd>
					<ResourceBoundary
						resource={nostrNetwork}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>registry name</dt>
				<dd>
					<ResourceBoundary
						resource={nostrNetwork}
					>
						{#snippet children(entity)}
							{entity.registryName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Connection model</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									relationshipModel: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.relationshipModel}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>home URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
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
					selection({
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
							<dt>docs URL</dt>
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
		</dl>
	{/snippet}
</EntityView>
