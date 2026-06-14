<script lang="ts">
	// Types/constants
	import { parse } from 'devalue'


	// State
	let {
		params,
	} = $props()

	import { isMarketEntitySelector } from '$/lib/isMarketEntityId.ts'

	const route = $derived.by(() => {
		const raw = params.marketKey ?? ''
		if (raw.length === 0) {
			return {
				marketId: null,
				error: 'Missing market id' as const,
			}
		}
		try {
			const id = parse((() => {
				try {
					return decodeURIComponent(raw)
				} catch {
					return raw
				}
			})())
			if (isMarketEntitySelector(id)) {
				return { marketId: id, error: null }
			}
		} catch {
			// fall through
		}
		return {
			marketId: null,
			error: 'Invalid or unsupported market id' as const,
		}
	})


	// Components
	import Page from '$/components/Page.svelte'
	import MarketView from '$/views/MarketView.svelte'

</script>


<svelte:head>
	<title>
		{route.marketId != null ? `Market` : 'Market · not found'}
	</title>
</svelte:head>


<Page>
	{#if route.error != null || route.marketId == null}
		<h1>
			Not found
		</h1>
		<p>
			{route.error}
		</p>
	{:else}
		<MarketView
			selector={route.marketId}
		/>
	{/if}
</Page>
