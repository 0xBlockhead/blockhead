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


	// Components
	import Page from '$/components/Page.svelte'
	import XrplTrustlineView from '$/views/XrplTrustlineView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'XRPL trustline'} • XRPL trustline • Blockhead</title>
</svelte:head>


<Page>
	<XrplTrustlineView
		selection={select(EntityType.XrplTrustline, data.selector)}
	/>
</Page>
