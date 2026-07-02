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
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccount_TimestampView from '$/views/LensAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>Lens account observation • Blockhead</title>
</svelte:head>


<Page>
	<LensAccount_TimestampView
		href={
			resolve('/(social)/(lens)/lens/account/[address=evmAddress]/(account)/observations/[timestampMs=nonNegativeInteger]', {
				address: params.address,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.LensAccount_Timestamp, data.selector, {
				fields: {
					followerCount: true,
					followingCount: true,
				},
			})
		}
	/>
</Page>
