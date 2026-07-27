<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
		{@const lensAccountSelector = lensAccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensAccount}
			entitySelector={lensAccountSelector}
			href={
				resolve(
					'/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]',
					{
						address: String(lensAccount.address),
					}
				)
			}
		>
			{#snippet Title()}
				{[(lensAccount.displayName ?? ''), (lensAccountSelector.localName ?? ''), String(lensAccountSelector.address), (lensAccountSelector.legacyProfileId ?? '')].filter(Boolean).join(' ') || 'Lens account'}
			{/snippet}

			{#snippet Value()}
				{[(lensAccountSelector.localName ?? ''), String(lensAccountSelector.address), (lensAccountSelector.legacyProfileId ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(lensAccount.createdAt ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
