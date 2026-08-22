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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AptosCoinBalance_Timestamp, {
		$account: data.selector,
		storageId: params.storageId,
		ledgerVersion: BigInt(params.ledgerVersion),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			assetType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AptosCoinBalance_TimestampView from '$/views/AptosCoinBalance_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'current Aptos coin balance observation' : pageSelection.entity.assetType || 'current Aptos coin balance observation')} • current Aptos coin balance observation • Blockhead</title>
</svelte:head>


<Page>
	<AptosCoinBalance_TimestampView
		selection={pageSelection}
	/>
</Page>
