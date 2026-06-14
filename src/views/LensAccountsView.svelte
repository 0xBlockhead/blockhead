<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
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
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

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
			{@const lensNetwork = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,
				{
					sources: [Source.Constants_Internal],
					fields: {
						protocolName: true,
						$$lensAccounts: {
							sources: [
								Source.Constants_Internal,
								Source.Lens_Graphql,
							],
						},
					},
				},
			)}
			{@const accounts = derive(
				lensNetwork,
				(lensNetwork) => (
					lensNetwork.fields.$$lensAccounts?.values
					?? []
				),
			)}
			{#key stringify(entityFieldReference.selector)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.LensAccount}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Selector])}
					getSortValue={(row) => stringify(row[EntityMetaKey.Selector])}
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
							selector={item[EntityMetaKey.Selector]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
