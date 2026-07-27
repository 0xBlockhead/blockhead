<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
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
	import SolanaProgramsView from '$/views/SolanaProgramsView.svelte'
</script>


<svelte:head>
	<title>Solana programs • Blockhead</title>
</svelte:head>


<Page>
	<SolanaProgramsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/programs',
				{
					network: String(params.network),
				}
			)
		}
		title='Solana programs'
		selection={select(EntityType.Network, data.selector).Solana.$$programs}
		id='programs'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
