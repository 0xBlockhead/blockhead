<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import XmtpView from '$/views/XmtpView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/xmtp')}
	id={stringify({
		scope: 'XmtpNetwork',
	})}
>
	{#snippet Summary({ open: _open })}
		<XmtpView
			entityId={{
				scope: 'XmtpNetwork',
			}}
			href={resolve('/xmtp')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
