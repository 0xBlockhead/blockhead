<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmNetworkBridge> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const evmNetworkBridge = $derived(selection({
		fields: {
			relationshipType: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.url ?? '') || 'EVM network bridge')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkBridge}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			'caip2' in selection.entitySelector.$toNetwork ?
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]',
					{
						network: (
							'caip2' in selection.entitySelector.$fromNetwork ?
								String(caip2StringFromValue(selection.entitySelector.$fromNetwork.caip2))
							:
								String(selection.entitySelector.$fromNetwork.slug)
						),
						toCaip2: String(caip2StringFromValue(selection.entitySelector.$toNetwork.caip2)),
						url: encodeURIComponent(String(selection.entitySelector.url)),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<a
			href={String(pendingEntity.url)}
			target="_blank"
			rel="noreferrer noopener"
		>
			<TruncatedValue value={String(pendingEntity.url)} />
		</a>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={String(pendingEntity.url)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmNetworkBridge}>
			{#snippet children(entity)}
				{@const relationshipType0 = entity.relationshipType}
				{#if relationshipType0 != null}
					<span data-text="muted">
						{relationshipType0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>URL</dt>
				<dd>
					<a
						href={String(pendingEntity.url)}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={String(pendingEntity.url)} />
					</a>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmNetworkBridge}
			>
				{#snippet children(entity)}
					{@const relationshipType = entity.relationshipType}
					{#if relationshipType != null}
						<div>
							<dt>Relationship type</dt>
							<dd>
								{relationshipType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>From network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$fromNetwork)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>To network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$toNetwork)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
