<script lang="ts">
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		id,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Profiles',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrNetwork>
			id: string
			open?: boolean
			title?: string
			collapsible?: boolean
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrProfile}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Nostr profiles are kind-0 metadata events keyed by the author’s secp256k1 pubkey (64 lowercase hex characters).
		</p>
		<p>
			Display name, bio, nip-05, and avatar come from the signed kind-0 JSON content, resolved via NostrBand indexers.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No Nostr profiles in this hub yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						$$nostrProfiles: {
							sources: [
								Source.Primal_Rest,
							],
						},
					},
				})} placeholderText="Loading profiles…">
				{#snippet children(network)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NostrProfile}
						id={`${id}-items`}
						{title}
						open={true}
						items={network.fields.$$nostrProfiles?.values ?? []}
						getKey={(profile) => stringify(profile[EntityMetaKey.Selector])}
						getSortValue={(profile) => profile[EntityMetaKey.Selector].pubkey}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No Nostr profiles in this hub yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(nostr)/nostr/profile/[pubkey]', {
									pubkey: item[EntityMetaKey.Selector].pubkey,
								})}
							>
								<TruncatedValue
									value={item[EntityMetaKey.Selector].pubkey}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
