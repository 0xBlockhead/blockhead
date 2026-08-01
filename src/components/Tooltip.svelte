<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'


	// State
	let {
		Content,
		children,
	}: {
		Content: Snippet
		children: Snippet
	} = $props()

	const popoverId = $props.id()

	let triggerEl: HTMLElement | null = $state(null)

	let popoverEl: HTMLElement | null = $state(null)


	// Functions
	const onTriggerEnter = () => {
		if (!triggerEl || !popoverEl) return

		popoverEl.showPopover({
			source: triggerEl,
		})
	}

	const onTriggerLeave = () => {
		if (!popoverEl) return

		popoverEl.hidePopover()
	}
</script>


<span class="tooltip-wrapper">
	<span
		class="tooltip-trigger"
		bind:this={triggerEl}
		role="button"
		tabindex="0"
		onmouseenter={onTriggerEnter}
		onmouseleave={onTriggerLeave}
		onfocus={onTriggerEnter}
		onblur={onTriggerLeave}
	>
		{@render children()}
	</span>

	<div
		id={popoverId}
		class="tooltip-content"
		popover="hint"
		bind:this={popoverEl}
	>
		{@render Content()}
	</div>
</span>


<style>
	.tooltip-wrapper {
		display: inline-flex;
	}

	.tooltip-trigger {
		anchor-name: --tooltip-anchor;
		cursor: default;
	}

	.tooltip-content {
		position: fixed;
		position-anchor: --tooltip-anchor;
		position-area: top;
		position-try-fallbacks:
			flip-block,
			flip-inline,
			flip-block flip-inline;
		position-visibility: anchors-visible;
		z-index: 100;
		padding: 0.375rem 0.5rem;
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: 0.375rem;
		box-shadow: 0 4px 16px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.35));
		margin-block-end: 6px;
		font-size: 0.875em;
		max-inline-size: min(20rem, 90vw);
		color: var(--color-fg);
	}

	.tooltip-content :global(p:first-child) {
		margin-block-start: 0;
	}

	.tooltip-content :global(p:last-child) {
		margin-block-end: 0;
	}

	.tooltip-content :global(p + p) {
		margin-block-start: 0.5em;
	}
</style>
