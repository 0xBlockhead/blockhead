<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterView from '$/views/FarcasterView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'Social'}
		href={resolve('/social')}
	>
		{#snippet children()}
			<section>
				<FarcasterView
					entityId={{
						scope: 'FarcasterNetwork',
					}}
					href={resolve('/farcaster')}
					open={false}
				/>
			</section>
		{/snippet}
	</GlobalView>
</Page>
