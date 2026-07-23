<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { SvelteHTMLElements } from 'svelte/elements'


	// State
	let {
		label,
		contentWarning,
		contentWarningRevealed = $bindable(false),

		Identity,
		Navigation,
		ThreadContext,
		SourceState,
		children,

		...articleProps
	}: WithRest<
		{
			label: string
			contentWarning?: string
			contentWarningRevealed?: boolean

			Identity: Snippet
			Navigation?: Snippet
			ThreadContext?: Snippet
			SourceState?: Snippet
			children: Snippet
		},
		SvelteHTMLElements['article']
	> = $props()

	const contentId = $props.id()
</script>


<article
	{...articleProps}
	data-card
	data-column="gap-3"
>
	<header data-column="gap-2">
		<div data-row="align-center wrap">
			{@render Identity()}
		</div>

		{#if Navigation}
			<nav aria-label={`${label} navigation`}>
				{@render Navigation()}
			</nav>
		{/if}
	</header>

	{#if ThreadContext}
		<aside aria-label={`${label} thread context`}>
			{@render ThreadContext()}
		</aside>
	{/if}

	{#if contentWarning && !contentWarningRevealed}
		<section
			data-card
			data-column="gap-2"
			aria-label="Content warning"
		>
			<p>{contentWarning}</p>

			<button
				type="button"
				aria-controls={contentId}
				aria-expanded="false"
				onclick={() => {
					contentWarningRevealed = true
				}}
			>
				Show content
			</button>
		</section>
	{:else}
		<div id={contentId}>
			{@render children()}
		</div>
	{/if}

	{#if SourceState}
		<footer aria-label={`${label} source state`}>
			{@render SourceState()}
		</footer>
	{/if}
</article>
