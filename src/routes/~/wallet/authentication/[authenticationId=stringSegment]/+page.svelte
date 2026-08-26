<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadWalletAuthentication, {
		authenticationId: params.authenticationId,
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadWalletAuthenticationView from '$/views/BlockheadWalletAuthenticationView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.authenticationId || 'blockhead wallet authentication'} • blockhead wallet authentication • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadWalletAuthenticationView
		selection={pageSelection}
	/>
</Page>
