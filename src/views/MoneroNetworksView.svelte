<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Monero networks',
		typeAnnotationParagraphs = ['Monero-specific view over a canonical Network row, with daemon RPC endpoints, node observations, and recent blocks.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MoneroNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.MoneroNetwork>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroNetwork}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			fields: {
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(moneroNetworks) => [...new Map(moneroNetworks.values.map((moneroNetwork) => [moneroNetwork[EntityMetaKey.SelectorKey], moneroNetwork])).values()]}
	getKey={(moneroNetwork) => moneroNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Monero networks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: moneroNetwork })}
		{@const moneroNetworkFields = { ...moneroNetwork[EntityMetaKey.Selector], ...moneroNetwork }}
		<EntityView
			entityType={EntityType.MoneroNetwork}
			entitySelector={moneroNetwork[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((moneroNetworkFields.$network.name) ?? '')].filter(Boolean).join(' ') || [moneroNetworkFields.$network.caip2 == null ? '' : String(`${(moneroNetworkFields.$network.caip2).namespace}:${(moneroNetworkFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ') || 'monero network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
