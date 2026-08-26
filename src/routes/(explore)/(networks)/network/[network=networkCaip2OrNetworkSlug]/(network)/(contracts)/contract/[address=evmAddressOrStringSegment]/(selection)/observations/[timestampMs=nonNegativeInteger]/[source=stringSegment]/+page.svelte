<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const entityViewByType = {
		[EntityType.HederaContract_Timestamp]: HederaContract_TimestampView,
		[EntityType.NearContract_Timestamp]: NearContract_TimestampView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import HederaContract_TimestampView from '$/views/HederaContract_TimestampView.svelte'
	import NearContract_TimestampView from '$/views/NearContract_TimestampView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.HederaContract_Timestamp ?
				('hedera contract timestamp') + ' • hedera contract timestamp • Blockhead'
			:
				(String(data.selector.timestampMs) || 'near contract timestamp') + ' • near contract timestamp • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.HederaContract_Timestamp ?
				select(EntityType.HederaContract_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
				select(EntityType.NearContract_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
		}
	/>
</Page>
