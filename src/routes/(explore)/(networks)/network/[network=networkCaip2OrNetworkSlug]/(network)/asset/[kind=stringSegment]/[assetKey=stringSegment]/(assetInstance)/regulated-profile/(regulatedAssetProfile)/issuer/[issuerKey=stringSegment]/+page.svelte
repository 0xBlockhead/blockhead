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
	import TrustedIssuerView from '$/views/TrustedIssuerView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'trusted issuer'} • trusted issuer • Blockhead</title>
</svelte:head>


<Page>
	<TrustedIssuerView
		selection={
			select(EntityType.TrustedIssuer, {
				$profile: data.selector,
				issuerKey: params.issuerKey,
			})
		}
	/>
</Page>
