<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import LightningNodeView from '$/views/LightningNodeView.svelte'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Node • Blockhead</title>
</svelte:head>


<Page>
	<LightningNodeView
		selection={select(EntityType.LightningNode, {
			$network: { slug: params.networkSlug },
			publicKey: params.pubkey,
		})}
		open={true}
	/>
</Page>
