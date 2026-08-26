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
		[EntityType.HederaToken_Timestamp]: HederaToken_TimestampView,
		[EntityType.TronToken_Timestamp]: TronToken_TimestampView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import HederaToken_TimestampView from '$/views/HederaToken_TimestampView.svelte'
	import TronToken_TimestampView from '$/views/TronToken_TimestampView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.HederaToken_Timestamp ?
				(String(data.selector.timestampMs) || 'hedera token timestamp') + ' • hedera token timestamp • Blockhead'
			:
				('tron token timestamp') + ' • tron token timestamp • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.HederaToken_Timestamp ?
				select(EntityType.HederaToken_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
			:
				select(EntityType.TronToken_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
		}
	/>
</Page>
