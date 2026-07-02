<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import BlockheadLightningPaymentsView from '$/views/BlockheadLightningPaymentsView.svelte'


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
	<title>Payments • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadLightningPaymentsView
		selection={select(EntityType.LightningNetwork, {
			$network: { slug: params.networkSlug },
		})[EntityProxyField]<EntityType.BlockheadLightningPayment>('$$payments')({ limit: 16 })}
		href={resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/payments', {
			networkSlug: params.networkSlug,
		})}
		id='payments'
	/>
</Page>
