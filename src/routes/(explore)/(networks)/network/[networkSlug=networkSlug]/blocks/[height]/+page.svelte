<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'


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
	<title>Block • Blockhead</title>
</svelte:head>


<Page>
	<UtxoBlockView
		selection={select(EntityType.UtxoBlock, {
			$network: { slug: params.networkSlug },
			height: BigInt(params.height),
		})}
		open={true}
	/>
</Page>
