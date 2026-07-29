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
		typeAnnotationParagraphs = ['XMTP transports encrypted payloads between inbox identities. This hub shows local conversation state from the seeded.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.XmtpNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XmtpNetwork}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: xmtpNetwork })}
		{@const xmtpNetworkSelector = xmtpNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XmtpNetwork}
			entitySelector={xmtpNetworkSelector}
			href={
				xmtpNetworkSelector.scope === 'XmtpNetwork' ?
					resolve('/(social)/(xmtp)/xmtp')
				:
					undefined
			}
		>
			{#snippet Title()}
				{xmtpNetwork.protocolName || 'XMTP'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
