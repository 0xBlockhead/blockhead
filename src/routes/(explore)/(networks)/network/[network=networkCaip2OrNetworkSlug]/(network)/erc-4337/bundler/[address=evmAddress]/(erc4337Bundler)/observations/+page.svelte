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
	import Erc4337Bundler_TimestampsView from '$/views/Erc4337Bundler_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Bundler observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.Erc4337Bundler, data.selector).$$timestamps}

	<Erc4337Bundler_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations',
				{
					network: params.network,
					address: params.address,
				}
			)
		}
		title='Bundler observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
