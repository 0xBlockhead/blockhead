<!-- Generated from APP.ts. -->

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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmNetworkBridge>, 'prefetched'> = $props()

	const fromNetwork = $derived(selection.entitySelector.$fromNetwork)
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
				'caip2' in selection.entitySelector.$toNetwork ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]',
						{
							network: (
								'caip2' in fromNetwork ?
									caip2StringFromValue(fromNetwork.caip2)
								:
									fromNetwork.slug
							),
							toCaip2: caip2StringFromValue(selection.entitySelector.$toNetwork.caip2),
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

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmNetworkBridge}
			>
				{#snippet children(entity)}
					{@const relationshipType = entity.relationshipType}
					{#if relationshipType != null}
						<div>
							<dt>relationship type</dt>
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
				<dt>from network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$fromNetwork)}
						layout={EntityLayout.Value}
						open={false}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>

			<div>
				<dt>to network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$toNetwork)}
						layout={EntityLayout.Value}
						open={false}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
