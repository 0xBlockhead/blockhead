<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Farcaster verified addresses',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FarcasterVerifiedAddresses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.FarcasterVerifiedAddress>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import FarcasterVerifiedAddressView from '$/views/FarcasterVerifiedAddressView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					address: true,
					protocol: true,
					fid: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterVerifiedAddress}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(farcasterVerifiedAddresses)}
			{@const uniqueFarcasterVerifiedAddresses = [...new Map(farcasterVerifiedAddresses.values.map((farcasterVerifiedAddress) => [farcasterVerifiedAddress[EntityMetaKey.SelectorKey], farcasterVerifiedAddress])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.FarcasterVerifiedAddress}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={farcasterVerifiedAddresses.totalCount}
				getKey={(farcasterVerifiedAddress) => farcasterVerifiedAddress[EntityMetaKey.SelectorKey]}
				items={uniqueFarcasterVerifiedAddresses}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Farcaster verified addresses yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: farcasterVerifiedAddress }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.FarcasterVerifiedAddress> })}
					{@const farcasterVerifiedAddressFields = { ...farcasterVerifiedAddress[EntityMetaKey.Selector], ...farcasterVerifiedAddress }}
					{@const farcasterVerifiedAddressHrefFields = { ...farcasterVerifiedAddress, ...farcasterVerifiedAddress[EntityMetaKey.Selector] }}
					<FarcasterVerifiedAddressView
						selection={select(EntityType.FarcasterVerifiedAddress, farcasterVerifiedAddress[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={farcasterVerifiedAddressFields}
						href={
							(farcasterVerifiedAddressHrefFields.fid !== undefined && farcasterVerifiedAddressHrefFields.protocol !== undefined && farcasterVerifiedAddressHrefFields.address !== undefined ? resolve('/(social)/(farcaster)/farcaster/user/[userId=farcasterFid]/(user)/verified-address/[protocol]/[address]', {
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
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.FarcasterVerifiedAddress}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
