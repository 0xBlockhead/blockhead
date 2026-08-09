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


	// Components
	import Page from '$/components/Page.svelte'
	import StellarAccountSigner_TimestampView from '$/views/StellarAccountSigner_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'stellar account signer timestamp'} • stellar account signer timestamp • Blockhead</title>
</svelte:head>


<Page>
	<StellarAccountSigner_TimestampView
		selection={
			select(EntityType.StellarAccountSigner_Timestamp, {
				$signer: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
