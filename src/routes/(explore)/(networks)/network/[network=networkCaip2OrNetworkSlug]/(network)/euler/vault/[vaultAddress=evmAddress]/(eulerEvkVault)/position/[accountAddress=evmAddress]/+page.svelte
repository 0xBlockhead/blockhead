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


	// Components
	import Page from '$/components/Page.svelte'
	import EulerEvkVaultPositionView from '$/views/EulerEvkVaultPositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EulerEvkVaultPosition, {
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
			})}
		<title>{data?.title ?? 'Euler EVK vault position'} • Euler EVK vault position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Euler EVK vault position'} • Euler EVK vault position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EulerEvkVaultPosition, {
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
			})}

	<EulerEvkVaultPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
