<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import ActorCoinView from '$/views/ActorCoinView.svelte'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
</script>


<Page>
	<ActorCoinView
		entityId={{
			$actor: {
				address: params.owner as `0x${string}`,
			},
			$coinInstance: {
				$network: { chainId: Number(params.chainId) },
				type: CoinInstanceType.Erc20Token,
				$contract: {
					$network: { chainId: Number(params.chainId) },
					address: params.coin as `0x${string}`,
				},
			},
		}}
	/>
</Page>
