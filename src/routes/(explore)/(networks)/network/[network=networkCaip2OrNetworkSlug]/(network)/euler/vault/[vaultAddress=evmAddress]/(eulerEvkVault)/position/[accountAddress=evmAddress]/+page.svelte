<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EulerEvkVaultPosition, {
		$account: {
			$network: data.selector.$network,
			$actor: {
				address: params.accountAddress,
			},
		},
		$vault: data.selector,
	}, {
		sources: [
			Source.Euler_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EulerEvkVaultPositionView from '$/views/EulerEvkVaultPositionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Euler EVK vault position'} • Euler EVK vault position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Euler EVK vault position'} • Euler EVK vault position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EulerEvkVaultPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
