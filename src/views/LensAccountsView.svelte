<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LensAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensAccount}
	bind:open
	resource={
		selection({
			fields: {
				address: true,
				$icon: true,
				displayName: true,
				localName: true,
				legacyProfileId: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: lensAccount })}
		<EntityView
			entityType={EntityType.LensAccount}
			entitySelector={lensAccount[EntityMetaKey.Selector]}
			href={
				resolve(
					'/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]',
					{
						address: lensAccount.address,
					}
				)
			}
		>
			{#snippet Title()}
				{[(lensAccount.displayName ?? ''), (lensAccount.localName ?? ''), lensAccount.address, (lensAccount.legacyProfileId ?? '')].filter(Boolean).join(' ') || 'Lens account'}
			{/snippet}

			{#snippet Value()}
				{[(lensAccount.localName ?? ''), lensAccount.address, (lensAccount.legacyProfileId ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{lensAccount.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
