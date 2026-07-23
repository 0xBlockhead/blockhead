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
		title = 'XMTP',
		typeAnnotationParagraphs = ['XMTP transports encrypted payloads between inbox identities. This hub shows local conversation state from the seeded.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XmtpNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.XmtpNetwork>
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
	entityType={EntityType.XmtpNetwork}
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
				scope: true,
			},
		})
	}
	{countResource}
	getResourceItems={(xmtpNetworks) => [...new Map(xmtpNetworks.values.map((xmtpNetwork) => [xmtpNetwork[EntityMetaKey.SelectorKey], xmtpNetwork])).values()]}
	getKey={(xmtpNetwork) => xmtpNetwork[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XMTP yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xmtpNetwork })}
		{@const xmtpNetworkFields = { ...xmtpNetwork[EntityMetaKey.Selector], ...xmtpNetwork }}
		<EntityView
			entityType={EntityType.XmtpNetwork}
			entitySelector={xmtpNetwork[EntityMetaKey.Selector]}
			href={
				(
					xmtpNetwork[EntityMetaKey.Selector].scope === 'XmtpNetwork' ?
						resolve('/xmtp')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((xmtpNetworkFields.protocolName) ?? '')].filter(Boolean).join(' ') || 'XMTP'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
