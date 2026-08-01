<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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

	const fromNetwork = $derived(selection.entitySelector.$fromNetwork)
	const toNetwork = $derived(selection.entitySelector.$toNetwork)
	const evmNetworkBridge = $derived(selection({
		fields: {
			relationshipType: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkBridge}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.url || 'EVM network bridge')}
	href={
		href === undefined ?
			(
				'caip2' in toNetwork ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]',
						{
							network: (
								'caip2' in fromNetwork ?
									caip2StringFromValue(fromNetwork.caip2)
								:
									fromNetwork.slug
							),
							toCaip2: caip2StringFromValue(toNetwork.caip2),
							url: encodeURIComponent(selection.entitySelector.url),
						}
					)
				:
					undefined
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

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmNetworkBridge}>
			{#snippet children(entity)}
				{@const relationshipType = entity.relationshipType}
				{#if relationshipType != null}
					<span data-text="muted">
						{relationshipType}
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
						href={selection.entitySelector.url}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.url} />
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
					/>
				</dd>
			</div>

			<div>
				<dt>To network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$toNetwork)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
