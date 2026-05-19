<script lang="ts">
	// Types/constants
	import { currencyByIso4217, type Iso4217 } from '$/constants/Currency.ts'


	const iso4217FromParam = (param: string): Iso4217 | null => (
		currencyByIso4217[param as Iso4217]?.iso4217 ?? null
	)


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// (Derived)
	const route = $derived.by(() => {
		const param = params.iso4217 ?? ''
		const iso4217 = iso4217FromParam(param)
		return { param, iso4217 }
	})


	// Components
	import Page from '$/components/Page.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<svelte:head>
	<title>
		{route.iso4217 ? currencyByIso4217[route.iso4217].name : route.param || 'Currency'}
	</title>
</svelte:head>


<Page>
	{#if route.iso4217 == null}
		<h1>
			Not found
		</h1>
		<p>
			Unknown ISO&nbsp;4217 code.
		</p>
	{:else}
		<CurrencyView
			entityId={{ iso4217: route.iso4217 }}
			href={resolve(
				'/(assets)/(currencies)/currency/[iso4217]',
				{ iso4217: route.iso4217 },
			)}
		/>
	{/if}
</Page>
