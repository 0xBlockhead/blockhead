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

	const pageSelection = $derived(select(EntityType.LensAccount_Timestamp, {
		$account: {
			address: decodeURIComponent(params.address),
		},
		timestampMs: Number(params.timestampMs),
	}, {
		sources: [
			Source.Lens_Graphql,
		],
		fields: {
			followerCount: true,
			followingCount: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'Lens account observation' : 'Lens account observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import LensAccount_TimestampView from '$/views/LensAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Lens account observation • Blockhead</title>
</svelte:head>


<Page>
	<LensAccount_TimestampView
		href={
			resolve('/lens/account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]', {
				address: params.address,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>
