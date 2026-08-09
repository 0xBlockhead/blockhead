<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Token program extensions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TokenProgramExtension_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TokenProgramExtension_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					extensionKind: true,
					extensionScope: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: tokenProgramExtensionTimestamp })}
		{@const tokenProgramExtensionTimestampSelector = tokenProgramExtensionTimestamp[EntityMetaKey.Selector]}
		{@const assetInstance = tokenProgramExtensionTimestampSelector.$assetInstance}
		<EntityView
			entityType={EntityType.TokenProgramExtension_Timestamp}
			entitySelector={tokenProgramExtensionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/extension/[extensionKind=stringSegment]/[extensionScope=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in assetInstance.$network ?
								caip2StringFromValue(assetInstance.$network.caip2)
							:
								assetInstance.$network.slug
						),
						kind: assetInstance.kind,
						assetKey: assetInstance.assetKey,
						extensionKind: tokenProgramExtensionTimestampSelector.extensionKind,
						extensionScope: tokenProgramExtensionTimestampSelector.extensionScope,
						timestampMs: String(tokenProgramExtensionTimestampSelector.timestampMs),
						source: tokenProgramExtensionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{tokenProgramExtensionTimestampSelector.extensionKind || 'token program extension timestamp'}
			{/snippet}

			{#snippet Value()}
				{tokenProgramExtensionTimestampSelector.extensionScope}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{tokenProgramExtensionTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
