<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FarcasterVerifiedAddress>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterVerifiedAddressView from '$/views/FarcasterVerifiedAddressView.svelte'
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
		{@const selection = select(EntityType.FarcasterVerifiedAddress, farcasterVerifiedAddress[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const farcasterVerifiedAddressHrefFields = { ...farcasterVerifiedAddress, ...farcasterVerifiedAddress[EntityMetaKey.Selector] }}
		<FarcasterVerifiedAddressView
			selection={selection}
			prefetched={farcasterVerifiedAddressFields}
			href={
				(farcasterVerifiedAddressHrefFields.fid !== undefined && farcasterVerifiedAddressHrefFields.protocol !== undefined && farcasterVerifiedAddressHrefFields.address !== undefined ? resolve('/farcaster/user/[userId=farcasterFid]/verified-address/[protocol=stringSegment]/[address=stringSegment]', {
					userId: String(farcasterVerifiedAddressHrefFields.fid ?? ''),
					protocol: String(farcasterVerifiedAddressHrefFields.protocol ?? ''),
					address: String(farcasterVerifiedAddressHrefFields.address ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
