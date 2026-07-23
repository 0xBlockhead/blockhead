<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'IPFS protocols',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'IpfsProtocols-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.IpfsProtocol>
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
	entityType={EntityType.IpfsProtocol}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				protocolName: true,
				relationshipModel: true,
				scope: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ipfsProtocols) => [...new Map(ipfsProtocols.values.map((ipfsProtocol) => [ipfsProtocol[EntityMetaKey.SelectorKey], ipfsProtocol])).values()]}
	getKey={(ipfsProtocol) => ipfsProtocol[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No IPFS protocols yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ipfsProtocol })}
		{@const ipfsProtocolFields = { ...ipfsProtocol[EntityMetaKey.Selector], ...ipfsProtocol }}
		<EntityView
			entityType={EntityType.IpfsProtocol}
			entitySelector={ipfsProtocol[EntityMetaKey.Selector]}
			href={
				(
					ipfsProtocol[EntityMetaKey.Selector].scope === 'IpfsProtocol' ?
						resolve('/ipfs')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((ipfsProtocolFields.protocolName) ?? '')].filter(Boolean).join(' ') || 'IPFS protocol'}
			{/snippet}

			{#snippet Value()}
				{[String((ipfsProtocolFields.relationshipModel) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
