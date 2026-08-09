<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.TronAccountTokenBalance_Timestamp ?
				select(EntityType.TronAccountTokenBalance_Timestamp, data.selector, {
					sources: [data.selector.source],
					fields: {
						tokenSymbol: true,
						tokenName: true,
						tokenId: true,
					},
				})
			:
				select(EntityType.HederaTokenAssociation_Timestamp, data.selector, {
					sources: [data.selector.source],
				})
		)
	)
	const entityViewByType = {
		[EntityType.TronAccountTokenBalance_Timestamp]: TronAccountTokenBalance_TimestampView,
		[EntityType.HederaTokenAssociation_Timestamp]: HederaTokenAssociation_TimestampView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import TronAccountTokenBalance_TimestampView from '$/views/TronAccountTokenBalance_TimestampView.svelte'
	import HederaTokenAssociation_TimestampView from '$/views/HederaTokenAssociation_TimestampView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.TronAccountTokenBalance_Timestamp ?
				(pageSelection.entity == null ? 'tron account token balance timestamp' : (pageSelection.entity.tokenSymbol ?? '') || [(pageSelection.entity.tokenName ?? ''), (pageSelection.entity.tokenId ?? '')].filter(Boolean).join(' ') || 'tron account token balance timestamp') + ' • tron account token balance timestamp • Blockhead'
			:
				('hedera token association timestamp') + ' • hedera token association timestamp • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>
