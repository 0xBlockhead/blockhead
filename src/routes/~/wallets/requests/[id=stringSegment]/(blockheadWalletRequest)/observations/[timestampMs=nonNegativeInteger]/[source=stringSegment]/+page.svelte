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

	const pageSelection = $derived(select(EntityType.BlockheadWalletRequest_Timestamp, {
		$walletRequest: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			status: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletRequest_TimestampView from '$/views/BlockheadWalletRequest_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead wallet request timestamp' : pageSelection.entity.status || 'blockhead wallet request timestamp')} • blockhead wallet request timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletRequest_TimestampView
		selection={pageSelection}
	/>
</Page>
