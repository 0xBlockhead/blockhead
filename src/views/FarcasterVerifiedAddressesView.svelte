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
		placeholderText = 'Loading Farcaster verified addresses...',
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
			selection.sources == null ? selection({
				fields: {
					address: true,
					protocol: true,
					fid: true,
				},
			}) : selection
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
				totalCount={farcasterVerifiedAddresses.values.length === uniqueFarcasterVerifiedAddresses.length && farcasterVerifiedAddresses.totalCount != null && farcasterVerifiedAddresses.totalCount >= uniqueFarcasterVerifiedAddresses.length ? farcasterVerifiedAddresses.totalCount : uniqueFarcasterVerifiedAddresses.length}
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
					<FarcasterVerifiedAddressView
						href={
							resolve('/(social)/(farcaster)/farcaster/user/[userId=farcasterFid]/(user)/verified-address/[protocol]/[address]', {
								userId: String(({ ...farcasterVerifiedAddress.entitySelector, ...farcasterVerifiedAddress }).fid),
								protocol: String(({ ...farcasterVerifiedAddress.entitySelector, ...farcasterVerifiedAddress }).protocol),
								address: String(({ ...farcasterVerifiedAddress.entitySelector, ...farcasterVerifiedAddress }).address),
							})
						}
						selection={select(EntityType.FarcasterVerifiedAddress, farcasterVerifiedAddress.entitySelector)}
						prefetched={farcasterVerifiedAddress}
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
