<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import BlockheadLightningInvoicesView from '$/views/BlockheadLightningInvoicesView.svelte'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Invoices • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningInvoicesView
		selection={select(EntityType.LightningNetwork, {
			$network: { slug: params.networkSlug },
		})[EntityProxyField]<EntityType.BlockheadLightningInvoice>('$$invoices')({ limit: 16 })}
		href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/invoices', {
			networkSlug: params.networkSlug,
		})}
		id='invoices'
	/>
</Page>
