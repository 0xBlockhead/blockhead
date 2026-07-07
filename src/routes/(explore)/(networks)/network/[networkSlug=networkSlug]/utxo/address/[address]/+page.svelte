<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<Page>
	<UtxoAddressView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]', {
				networkSlug: params.networkSlug,
				address: params.address,
			})
		}
		selection={
			select(EntityType.UtxoAddress, {
				$network: {
					slug: params.networkSlug,
				},
				address: decodeURIComponent(params.address),
			})
		}
	/>
</Page>
