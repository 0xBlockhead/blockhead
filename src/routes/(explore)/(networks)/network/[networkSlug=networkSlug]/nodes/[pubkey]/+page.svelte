<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<Page>
	<LightningNodeView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
				networkSlug: params.networkSlug,
				pubkey: params.pubkey,
			})
		}
		selection={
			select(EntityType.LightningNode, {
				$network: {
					slug: params.networkSlug,
				},
				publicKey: params.pubkey,
			}, {
				sources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				],
				fields: {
					alias: true,
					channelCount: true,
					capacitySats: true,
					countryCode: true,
					city: true,
					networkAddresses: true,
				},
			})
		}
	/>
</Page>
