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
	import Erc4337AccountFactory_TimestampsView from '$/views/Erc4337AccountFactory_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Account factory observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.Erc4337AccountFactory, data.selector).$$timestamps}

	<Erc4337AccountFactory_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations',
				{
					network: String(params.network),
					address: String(params.address),
				}
			)
		}
		title='Account factory observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
