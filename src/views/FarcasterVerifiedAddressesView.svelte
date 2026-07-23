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
		title = 'Farcaster verified addresses',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterVerifiedAddresses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FarcasterVerifiedAddress>
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
	entityType={EntityType.FarcasterVerifiedAddress}
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
				address: true,
				protocol: true,
				fid: true,
			},
		})
	}
	{countResource}
	getResourceItems={(farcasterVerifiedAddresses) => [...new Map(farcasterVerifiedAddresses.values.map((farcasterVerifiedAddress) => [farcasterVerifiedAddress[EntityMetaKey.SelectorKey], farcasterVerifiedAddress])).values()]}
	getKey={(farcasterVerifiedAddress) => farcasterVerifiedAddress[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Farcaster verified addresses yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: farcasterVerifiedAddress })}
		{@const farcasterVerifiedAddressFields = { ...farcasterVerifiedAddress[EntityMetaKey.Selector], ...farcasterVerifiedAddress }}
		<EntityView
			entityType={EntityType.FarcasterVerifiedAddress}
			entitySelector={farcasterVerifiedAddress[EntityMetaKey.Selector]}
			href={
				(
					farcasterVerifiedAddress[EntityMetaKey.Selector] != null && 'fid' in farcasterVerifiedAddress[EntityMetaKey.Selector]
					&& farcasterVerifiedAddress[EntityMetaKey.Selector].fid != null
					&& farcasterVerifiedAddress[EntityMetaKey.Selector] != null && 'protocol' in farcasterVerifiedAddress[EntityMetaKey.Selector]
					&& farcasterVerifiedAddress[EntityMetaKey.Selector].protocol != null
					&& farcasterVerifiedAddress[EntityMetaKey.Selector] != null && 'address' in farcasterVerifiedAddress[EntityMetaKey.Selector]
					&& farcasterVerifiedAddress[EntityMetaKey.Selector].address != null ?
						resolve('/farcaster/user/[userId=farcasterFid]/verified-address/[protocol=stringSegment]/[address=stringSegment]', {
					userId: String(farcasterVerifiedAddress[EntityMetaKey.Selector].fid ?? ''),
					protocol: String(farcasterVerifiedAddress[EntityMetaKey.Selector].protocol ?? ''),
					address: String(farcasterVerifiedAddress[EntityMetaKey.Selector].address ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((farcasterVerifiedAddressFields.address) ?? '')].filter(Boolean).join(' ') || 'Farcaster verified address'}
			{/snippet}

			{#snippet Value()}
				{[String((farcasterVerifiedAddressFields.protocol) ?? ''), String((farcasterVerifiedAddressFields.fid) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
