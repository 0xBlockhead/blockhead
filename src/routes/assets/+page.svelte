<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title="Assets"
		href={resolve('/assets')}
	>
		{#snippet children()}
			<section>
				<CoinsView
					href={resolve('/coins')}
					id="assets-coins"
					open={false}
				/>
			</section>

			<section>
				<LiquidityPoolsView
					href={resolve('/pools')}
					id="assets-pools"
					open={false}
				/>
			</section>
		{/snippet}
	</GlobalView>
</Page>
