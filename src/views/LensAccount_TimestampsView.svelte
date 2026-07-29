<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.LensAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$account: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: lensAccountTimestamp })}
		{@const lensAccountTimestampSelector = lensAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = lensAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.LensAccount_Timestamp}
			entitySelector={lensAccountTimestampSelector}
			href={
				'address' in account ?
					resolve(
						'/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/observations/[timestampMs=nonNegativeInteger]',
						{
							address: account.address,
							timestampMs: String(lensAccountTimestampSelector.timestampMs),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{[(lensAccountTimestamp.$account.displayName ?? ''), (lensAccountTimestampSelector.$account.localName ?? ''), lensAccountTimestampSelector.$account.address, (lensAccountTimestampSelector.$account.legacyProfileId ?? '')].filter(Boolean).join(' ') || 'Lens account'}
			{/snippet}

			{#snippet Value()}
				{lensAccountTimestampSelector.timestampMs}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
