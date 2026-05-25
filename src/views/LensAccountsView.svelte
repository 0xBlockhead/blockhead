<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Props
	let {
		entityFieldReference,
		id,
		open = $bindable(true),
		collapsible = true,
		title = 'Lens v3 profiles',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.LensAccount>
			id: string
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensAccount}
	{id}
	bind:open
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens profiles are on-chain publisher identities tied to an address.
		</p>
		<p>
			Publications for the Lens network aggregate in resolver-backed feeds; profile-scoped indexes align with that network’s publication graph.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const lensNetwork = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [Source.Constants_Internal],
					protocolName: {},
					$$lensAccounts: {
						$: [
							Source.Constants_Internal,
							Source.Lens_Graphql,
							Source.Lens_HeyGraphql,
						],
					},
				},
			)}
			{@const accounts = derive(
				lensNetwork,
				(lensNetwork) => (
					lensNetwork.$$lensAccounts
					?? []
				),
			)}
			{#key stringify(entityFieldReference.entityId)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.LensAccount}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Id])}
					getSortValue={(row) => row[EntityMetaKey.Id].address}
					placeholderText="Loading Lens network…"
					resource={accounts}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No Lens profiles for this slice yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<LensAccountView
							entityId={{ address: item[EntityMetaKey.Id].address }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
