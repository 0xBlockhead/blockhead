<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import ActorsView from '$/views/ActorsView.svelte'
	import Page from '$/components/Page.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import XmtpConversationsView from '$/views/XmtpConversationsView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title={'XMTP'}
		href={resolve('/xmtp')}
	>
		{#snippet children()}
			<section>
				<ActorsView
					href={resolve('/xmtp/accounts')}
					id="xmtp-accounts"
					open={false}
				/>
			</section>

			<section>
				<XmtpConversationsView
					href={resolve('/xmtp/conversations')}
					id="xmtp-conversations"
					open={false}
				/>
			</section>
		{/snippet}
	</GlobalView>
</Page>
